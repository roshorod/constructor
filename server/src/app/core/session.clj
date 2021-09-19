(ns app.core.session
  (:require [clj-time.core :refer [plus now minutes
                                   after? date-time]]
            [clj-time.coerce :refer [from-string]]))

(def ^:private expire-time 1)

(defn get-cookie-expire []
  (plus (now) (minutes expire-time)))

(defn get-request-cookie [request]
  (let [cookies (get request :cookies)
        session (get cookies "JSESSIONID")]
    (get session :value)))

(defn is-cookie-expire? [expire-date]
  (after? (now) (from-string expire-date)))
