(ns app.middleware
  (:require [ring.middleware.reload :refer [wrap-reload]]
            [ring.middleware.session :refer [wrap-session]]
            [ring.middleware.cookies :refer [wrap-cookies]]
            [taoensso.timbre :as log]
            [app.redis :as redis]
            [app.router :as router]
            [app.session :as sess]))

(defn wrap-session-expire [handler]
  (fn [request]
    (let [br-cookie (sess/get-request-cookie request)]
      (if (not-empty (redis/get-value br-cookie))
        (let [expire (get (redis/get-value br-cookie) :expires)]
          (println (sess/is-cookie-expire? expire) "from" expire))
        (redis/set-value br-cookie {:expires (str sess/get-cookie-expire)}))
      (handler (assoc request :session {:cookies br-cookie})))))

(def app-middleware
  (-> router/app-routers
      wrap-session-expire
      wrap-reload
      wrap-cookies
      wrap-session))
