(ns app.server
  (:require [org.httpkit.server :as httpd]
            [mount.core :as mount]
            [app.middleware :refer [app-middleware]]))

(mount/defstate ^{:on-reload :noop}
  server-start
  :start (do
           (println "Starting the server on port: " server-port)
           (httpd/run-server app-middleware {:port 3000})
           (.addShutdownHook (Runtime/getRuntime) (Thread. mount/stop)))
  :stop (shutdown-agents))

(defn -main [& args]
  (-> (mount/start
       #'app.server/server-start)))
