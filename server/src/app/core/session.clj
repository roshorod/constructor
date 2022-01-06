(ns app.core.session
  (:require [clojure.core.async :refer [go-loop timeout <!]]
            [clj-time.core :refer [plus now minutes after?]]
            [clj-time.coerce :refer [from-string]]
            [mount.core :as mount]
            [taoensso.timbre :as log]
            [app.core.element :refer [->Element]]
            [app.core.redis :as redis]))

(def ^:private expire-time 20)
(def ^:private watcher-timeout 120000)

(def ^:private table-name "session-table")

(defprotocol ^:private SessionRoutines
  "Should not be used outside.
  Wrappers for database interaction.
  Used only for manage table which containg sessions id"
  (create! [session]
    "Append record into table-name. If records is null create empty vec.")
  (delete! [session]
    "Filter all sessions with same id field. Soft delete")
  (dispose! [session]
    "Send delete request to store. Hard delete"))

(defprotocol SessionProtocol
  "Every session has own life time. After it expired
  should be deleted from store"
  (create [this])
  (delete [this])
  (refresh [this])
  (expired? [this]
    "If not exipred return false")
  (created? [this])
  (append-element [this element])
  (delete-element [this element])
  (get-elements [this])
  (contains-elements? [this]
    "If contain return true. If not false"))

(defn- get-expire-time []
  (str (plus (now) (minutes expire-time))))

(defrecord Session [^String id]
  SessionRoutines
  (create! [this]
    (let [sessions (redis/get-val table-name)]
      (delete! this)
      (if (not (nil? sessions))
        (redis/set-val table-name (conj sessions id))
        (redis/set-val table-name [id]))))
  (delete! [this]
    (let [sessions (redis/get-val table-name)
          body     (->> sessions
                        (filter #(not (= id %))))]
      (if (empty? body)
        (dispose! this)
        (redis/set-val table-name body))))
  (dispose! [_]
    (redis/del-val table-name))

  SessionProtocol
  (create [^Session this]
    (let [session (redis/get-val id)]
      (if (nil? session)
        (do (create! this)
            (redis/set-val id {:expires (get-expire-time) :elements []}))
        (refresh this))))
  (delete [this]
    (let [elements (:elements (redis/get-val id))]
      (mapv #(redis/del-val %) elements)
      (delete! this)
      (redis/del-val id)))
  (refresh [_]
    (let [session    (redis/get-val id)
          new-expire (assoc session :expires
                            (get-expire-time))]
      (if (not (nil? session))
        (redis/set-val id new-expire)
        (throw (AssertionError. "Cannot find session. Refresh stopped")))))
  (expired? [_]
    (let [session (redis/get-val id)
          expire  (:expires session)]
      (if (not (nil? session))
        (after? (now) (from-string expire))
        (throw (AssertionError. "Cannot find session. Expire check stopped")))))
  (created? [_]
    (let [session (redis/get-val id)]
      (if (not (nil? session))
        true
        false)))
  (append-element [this element]
    (let [session  (redis/get-val id)
          elements (:elements
                    (if (nil? (:elements session))
                      (assoc session :elements [])
                      session))]
      (if (not (nil? session))
        (do
          (app.core.element/create element)
          (redis/set-val
            id
            (assoc
              session
              :elements (conj elements (:id element))))
          (refresh this))
        (throw
          (AssertionError.
            "Cannot find session. Cannot append element. session not found.")))))
  (delete-element [_ element]
    (let [session  (redis/get-val id)
          elements (filter
                     #(not
                        (= (:id element) %))
                     (:elements session))]
      (redis/del-val (:id element))
      (redis/set-val id (assoc
                          session
                          :elements (if (empty? elements)
                                      []
                                      elements)))))
  (get-elements [_]
    (let [session (redis/get-val id)]
      (reduce
        into []
        (map
          (fn [element]
            [(-> (redis/get-val element))])
          (:elements session)))))
  (contains-elements? [_]
    (let [elements (:elements (redis/get-val id))]
      (if (empty? elements)
        false
        true))))

(comment
  "All crud operations"
  (create (Session. "test1"))
  (created? (Session. "test1"))

  (append-element
    (Session. "test1")
    (->Element "test2" {:test "test"}))

  (append-element
    (Session. "test1")
    (->Element "test3" {:test "test"}))

  (delete-element
    (Session. "test1")
    (->Element "test3" {:test "test"}))

  (get-elements (Session. "test"))

  (expired? (Session. "test1"))
  (contains-elements? (Session. "test"))

  (delete (Session. "test1"))

  (let [session  (Session. "test")
        session1 (Session. "test1")]
    (delete session)
    (delete session)
    (try
      (refresh session)
      (catch AssertionError _))
    (create session)
    (refresh session)
    (create session1)
    (delete session)
    (delete session1)))

(mount/defstate
  expire-watcher
  :start (try
           (go-loop []
             (let [sessions (redis/get-val table-name)]
               (mapv
                 #(let [session (Session. %)]
                    (if (expired? session)
                      (do (delete session)
                          (log/info "Session:" (:id session) "was removed"))
                      nil))
                 sessions)
               (<! (timeout watcher-timeout))
               (recur)))
           (catch Exception e
             (log/warn e))))
