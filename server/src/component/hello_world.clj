(ns component.hello-world
  (:require [hiccup.core :refer [html h]]
            [app.redis :as redis]))

(defn- get-cookie [request]
  (let [cookies (get request :cookies)
        session (get cookies "JSESSIONID")]
     (get session :value)))

(defn hello-world [params]
  (let [cookie (get-cookie params)]
    (redis/set-value cookie cookie)
    {:body
     (html [:div
            [:h3 "Current cookie: "
             (str (redis/get-value cookie))]])
     :session {:cookies cookie}}))
