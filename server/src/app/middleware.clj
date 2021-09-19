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
      (if-let [has? (contains? (redis/get-val br-cookie) :expires)]
        (if (sess/is-cookie-expire? (str (get (redis/get-val br-cookie) :expires)))
          (redis/set-val br-cookie {:expires (str (sess/get-cookie-expire))}))
        (redis/set-val br-cookie {:expires (str (sess/get-cookie-expire))}))
      (handler (assoc request :session {:cookies br-cookie})))))

(def app-middleware
  (-> router/app-routers
      wrap-session-expire
      wrap-reload
      wrap-cookies
      wrap-session))
