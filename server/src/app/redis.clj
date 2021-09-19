(ns app.redis
  (:require [taoensso.carmine :as car]
            [mount.core :as mount]
            [taoensso.timbre :as log]))

(def ^:private redis-uri "redis://127.0.0.1:6379")

(def ^:private redis-conn {:pool {} :spec {:uri redis-uri}})

(defmacro ^:private wcar* [& body] `(car/wcar ~redis-conn ~@body))

(mount/defstate redis-start
  :start (do
           (log/info "Trying to start redis:" redis-uri)
           (try
             (wcar* (car/ping))
             (log/info "Redis started on:" redis-uri)
             (catch Exception e
               (mount/stop redis-start))))
  :stop (log/info "Close th redis connection..."))

(defn set-val [key? value?]
  (try
    (wcar* (car/set key? value?))
    (catch Exception e
      (log/warn "Cann't set value." e))))

(defn get-val [key?]
  (try
    (wcar* (car/get key?))
    (catch Exception e
      (log/warn "Cann't get value" e))))

(defn del-val [key?]
  (try
    (wcar* (car/del key?))
    (catch Exception e
      (log/warn "Cann't get value" e))))
