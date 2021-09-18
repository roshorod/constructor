(ns app.server
  (:gen-class)
  (:require [org.httpkit.server :as httpd]
            [ring.util.response :as responce]
            [ring.middleware.reload :refer [wrap-reload]]
            [compojure.core :as compojure]
            [mount.core :as mount]
            [hiccup.core :refer [html h]]))

(def server-port 3000)

(defn hello-world [req]
  (html [:div
         [:h1 "Hello world"]]))

(def routers
  (compojure/routes
   (compojure/GET "/" req hello-world)))

(def server-handler (-> routers
                     wrap-reload))

(mount/defstate ^{:on-reload :noop}
  server-start
  :start (do
           (println "Starting the server on port: " server-port)
           (httpd/run-server server-handler {:port server-port})
           (.addShutdownHook (Runtime/getRuntime) (Thread. mount/stop)))
  :stop (shutdown-agents))

(defn start [& args]
  (-> (mount/start
       #'app.server/server-start)))
