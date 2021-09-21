(ns app.server
  (:require [org.httpkit.server :as httpd]
            [mount.core :as mount]
            [taoensso.timbre :as log]
            [app.middleware :refer [app-middleware]]))

(def server-port 3000)

(mount/defstate ^{:on-reload :noop}
  server-start
  :start (do
           (log/info "Starting the server on port:" server-port)
           (httpd/run-server app-middleware {:port server-port})

           (-> (mount/start
                 #'app.core.redis/redis-start))

           (.addShutdownHook (Runtime/getRuntime) (Thread. mount/stop)))
  :stop (do
          (log/info "Shutdowning the server...")
          (shutdown-agents)))

(defn- start [& args]
  (-> (mount/start
        #'app.server/server-start)))
