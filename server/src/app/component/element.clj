(ns component.element
  (:require [hiccup.core :refer [html h]]))

(defn element-get [request]
  {:body
   (html [:h3 (str request)])})
