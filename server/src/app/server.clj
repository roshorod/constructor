(ns app.server
  (:require [org.httpkit.server :as httpd]
            [mount.core :as mount]
            [app.middleware :refer [app-middleware]]))

(def server-port 3000)

(mount/defstate ^{:on-reload :noop}
  server-start
  :start (do
           (println "Starting the server on port: " server-port)
           (httpd/run-server app-middleware {:port server-port})
           (.addShutdownHook (Runtime/getRuntime) (Thread. mount/stop)))
  :stop (shutdown-agents))

(defn- start [& args]
  (-> (mount/start
       #'app.server/server-start)))
