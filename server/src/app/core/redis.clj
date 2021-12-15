(ns app.core.redis
  (:require [environ.core :refer [env]]
            [mount.core :as mount]
            [taoensso.carmine :as car]
            [taoensso.timbre :as log]))

(def ^:private redis-uri (or (System/getenv "REDIS_URL") (env :redis-uri)))
(def ^:private redis-conn {:pool {} :spec {:uri redis-uri}})

(defmacro ^:private wcar* [& body] `(car/wcar ~redis-conn ~@body))

(mount/defstate
  redis-start
  :start (try
           (wcar* (car/ping))
           (log/info "Redis started on:" redis-uri)
           (catch Exception e
             (mount/stop redis-start)))
  :stop (log/info "Close th redis connection..."))

(defn set-val [key? value?]
  (wcar* (car/set key? value?)))

(defn get-val [key?]
  (wcar* (car/get key?)))

(defn del-val [key?]
  (wcar* (car/del key?)))
