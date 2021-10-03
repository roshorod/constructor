(ns app.router
  (:require [compojure.core :as compojure]
            [app.component.element :refer [element-get
                                           element-post]]))

(compojure/defroutes element-routes
  (compojure/GET "/element" request element-get)
  (compojure/POST "/element" request element-post))

(compojure/defroutes app-routers
  (compojure/context "/api/:session-id" request element-routes))
