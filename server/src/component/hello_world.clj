(ns component.hello-world
  (:require [hiccup.core :refer [html h]]))

(defn- get-cookie [request]
  (let [cookies (get request :cookies)
        session (get cookies "JSESSIONID")]
    (get session :value)))

(defn hello-world [params]
  {:body
   (html [:div
          [:h3 "Current cookie: "
           [:br
            (str (get params :session))]]])
   :session {:cookies (get-cookie params)}})
