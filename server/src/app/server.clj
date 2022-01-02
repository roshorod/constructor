(ns app.server
  (:gen-class :main true)
  (:require [aleph.http :as httpd]
            [mount.core :as mount]
            [taoensso.timbre :as log]
            [environ.core :refer [env]]
            [app.middleware :refer [app-middleware]]))

(defn- ->int [str]
  (if (re-matches (re-pattern "\\d+") str)
    (read-string str)
    nil))

(mount/defstate ^{:on-reload :noop}
  server-start
  :start (let [port (->int (env :port))
               host (env :host)]
           (log/info "Starting on" (str host ":" port))

           (httpd/start-server app-middleware {:port     port
                                               :host     host
                                               :websoket true})

           (-> (mount/start 'expire-watcher))

           (.addShutdownHook (Runtime/getRuntime) (Thread. mount/stop)))
  :stop (do
          (log/info "Shutdowning the server...")
          (shutdown-agents)))

; Way to configure logs https://stackoverflow.com/a/69130936
(log/merge-config! {:timestamp-opts {:pattern ""}})

(defn -main [& _]
  (mount/start))
