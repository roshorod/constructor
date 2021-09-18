(ns app.middleware
  (:require [ring.middleware.reload :refer [wrap-reload]]
            [ring.middleware.session :refer [wrap-session]]
            [ring.middleware.cookies :refer [wrap-cookies]]
            [app.router :as router]))

(def app-middleware (-> router/app-routers
                        wrap-reload
                        wrap-session
                        wrap-cookies))
