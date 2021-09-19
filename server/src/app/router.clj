(ns app.router
  (:require [compojure.core :as compojure]
            [ring.util.response :as responce]
            [hiccup.core :refer [html h]]
            [component.element :refer [element-get]]
            [component.hello-world :refer [hello-world]]))

(compojure/defroutes element-routes
  (compojure/GET "/element" request element-get))

(compojure/defroutes app-routers
  (compojure/GET "/" request hello-world)
  (compojure/context "/api/:session-id" [session-id] element-routes))
