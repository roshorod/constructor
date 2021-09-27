(ns app.core.session
  (:require [clj-time.core :refer [plus now minutes
                                   after?]]
            [clj-time.coerce :refer [from-string]]
            [app.core.redis :as redis]))

(def ^:private expire-time 1)

(defn ^:private get-session-expire-time []
  (str (plus (now) (minutes expire-time))))

(defn ^:private set-session [session-id]
  (redis/set-val
    session-id
    {:expires (get-session-expire-time)}))

(defn is-session-expired [session-id]
  (let [session (redis/get-val session-id)
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
