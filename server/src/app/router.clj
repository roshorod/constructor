(ns app.router
  (:require [compojure.core :as compojure]
            [app.component.element :refer [element-get]]
            [app.component.hello-world :refer [hello-world]]))

(compojure/defroutes element-routes
  (compojure/GET "/element" request element-get))

(compojure/defroutes app-routers
  (compojure/GET "/" request hello-world)
  (compojure/context "/api/:session-id" [session-id] element-routes))
