(ns app.session
  (:require [clj-time.core :refer [now minutes from-now after? date-time]]
            [clj-time.coerce :refer [from-string]]))

(def expire-time 1)

(def get-cookie-expire (-> expire-time minutes from-now))

(defn get-request-cookie [request]
  (let [cookies (get request :cookies)
        session (get cookies "JSESSIONID")]
    (get session :value)))

(defn is-cookie-expire? [expire-date]
  (after? (now) (from-string expire-date)))
