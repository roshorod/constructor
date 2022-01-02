(ns app.core.redis
  (:require [environ.core :refer [env]]
            [taoensso.carmine :as car]))

(def ^:private redis-conn {:pool {} :spec {:uri (env :redis-uri)}})

(defmacro ^:private wcar* [& body] `(car/wcar ~redis-conn ~@body))

(defn set-val [key? value?]
  (wcar* (car/set key? value?)))

(defn get-val [key?]
  (wcar* (car/get key?)))

(defn del-val [key?]
  (wcar* (car/del key?)))
