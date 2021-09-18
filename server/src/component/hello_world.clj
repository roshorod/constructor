(ns component.hello-world
  (:require [hiccup.core :refer [html h]]))

(defn hello-world [params]
  (println (get params :session))
  {:body
   (html [:div
          [:h1 "Hello world"]])
   :session {:cookies (get params :cookies)}})
