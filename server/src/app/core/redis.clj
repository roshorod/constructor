(ns app.core.redis
  (:require [taoensso.carmine :as car]
            [mount.core :as mount]
            [taoensso.timbre :as log]))

(def ^:private redis-uri "redis://127.0.0.1:6379")

(def ^:private redis-conn {:pool {} :spec {:uri redis-uri}})

(defmacro ^:private wcar* [& body] `(car/wcar ~redis-conn ~@body))

(mount/defstate redis-start
  :start (try (do
                (wcar* (car/ping))
                (log/info "Redis started on:" redis-uri))
              (catch Exception e
                (mount/stop redis-start)))
  :stop (log/info "Close th redis connection..."))

(defn set-val [key? value?]
  (wcar* (car/set key? value?)))

(defn get-val [key?]
  (wcar* (car/get key?)))

(defn del-val [key?]
  (wcar* (car/del key?)))
