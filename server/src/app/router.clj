(ns app.router
  (:require [compojure.core :as compojure]
            [ring.util.response :as responce]
            [hiccup.core :refer [html h]]

            [component.hello-world :refer [hello-world]]))

(def app-routers (compojure/routes
                  (compojure/GET "/" params  hello-world)))
