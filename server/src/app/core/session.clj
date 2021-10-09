(ns app.core.session
  (:require [clj-time.core :refer [plus now minutes
                                   after?]]
            [clj-time.coerce :refer [from-string]]
            [mount.core :as mount]
            [taoensso.timbre :as log]
            [app.core.redis :as redis]))


(def ^:private expire-time 1)
(def ^:private session-table-name "session-table")
(def ^:private session-watcher-timeout 60000)


(defn ^:private get-session-expire-time []
  (str (plus (now) (minutes expire-time))))

(defn ^:private store-session-table
  "Save session into table for asserting the expire time."
  [session-id]
  (if (nil? (redis/get-val session-table-name))
    (redis/set-val
      session-table-name []))
  (let [session-table (redis/get-val session-table-name)]
    (redis/set-val
      session-table-name
      (conj session-table session-id))))

(defn ^:private set-session [session-id]
  (store-session-table session-id)
  (redis/set-val
    session-id
    {:expires (get-session-expire-time)}))

(defn is-session-expired [session-id]
  (let [session     (redis/get-val session-id)
        expire-date (:expires session)]
    (after? (now) (from-string expire-date))))

(defn update-session [session-id]
  (let [current-session (redis/get-val session-id)
        updated         (assoc current-session :expires (get-session-expire-time))]
    (redis/set-val session-id updated)))

(defn start-session [session-id]
  (let [session (redis/get-val session-id)]
    (if (nil? session) (set-session session-id)
        (if (contains? session :expires)
          (update-session session-id)
          nil))))

(defn ensure-session
  "Look into session table.
  If session expire delete it from store by filter.
  Also removing session dependent elements."
  [session-id]
  (let [expired (is-session-expired session-id)]
    (if expired
      (let [session-table (redis/get-val session-table-name)]
        (redis/set-val
          session-table-name
          (into
            []
            (filter
              #(not
                 (some
                   (fn [session-name]
                     (= session-name %)) [session-id])) session-table)))

        (mapv (fn [element-id]
               (redis/del-val element-id))
             (get (redis/get-val session-id) :elements))

        (redis/del-val session-id)
        (log/info "Removed from store:" session-id)))))

;; State for checking if session expire and then delete if it expired.
(mount/defstate
  session-expire-watcher
  :start (try
           (loop []
             (let [sessions (redis/get-val session-table-name)]
               (mapv ensure-session sessions))
             (Thread/sleep session-watcher-timeout)
             (recur))
           (catch Exception e
             (log/warn e)))
  :stop (log/info "Session watcher"))
