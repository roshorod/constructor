(ns app.router
  (:require [compojure.core :as compojure]
            [app.controller.element :refer [element-ws-handler]]))

(def bad-ws-request
  {:status  400
   :headers {"content-type" "application/text"}
   :body    "Expected a websocket request."})

(compojure/defroutes element-routes
  (compojure/GET "/" _ element-ws-handler))

(compojure/defroutes app-routers
  (compojure/context "/api/element" _ element-routes))
