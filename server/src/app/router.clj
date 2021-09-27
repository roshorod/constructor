(ns app.router
  (:require [compojure.core :as compojure]
            [app.component.element :refer [element-get
                                           element-post]]
            [app.component.hello-world :refer [hello-world]]))

(compojure/defroutes element-routes
  (compojure/GET "/element" request element-get)
  (compojure/POST "/element" request element-post))

(compojure/defroutes app-routers
  (compojure/GET "/" request hello-world)
  (compojure/context "/api/:session-id" request element-routes))
