(ns app.router
  (:require [compojure.core :as compojure]
            [app.controller.element :refer [element-get
                                            element-post
                                            element-post-by-id
                                            element-delete]]))

(compojure/defroutes element-routes
  (compojure/GET "/element" request element-get)
  (compojure/POST "/element" request element-post)
  (compojure/POST "/element/:element-id" request element-post-by-id)
  (compojure/DELETE "/element/:element-id" request element-delete))

(compojure/defroutes app-routers
  (compojure/context "/api/:session-id" request element-routes))
