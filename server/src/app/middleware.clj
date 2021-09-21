(ns app.middleware
  (:require [ring.middleware.reload :refer [wrap-reload]]
            [ring.middleware.session :refer [wrap-session]]
            [ring.middleware.cookies :refer [wrap-cookies]]
            [ring.middleware.json :refer [wrap-json-body
                                          wrap-json-response]]
            [app.router :as router]
            [app.core.redis :as redis]
            [app.core.session :refer [is-cookie-expire?
                                      get-cookie-expire
                                      get-request-cookie]]))

(defn wrap-session-expire [handler]
  (fn [request]
    (let [cookie       (get-request-cookie request)
          expired-time (str (get-cookie-expire))]
      (if-let [has? (contains? (redis/get-val cookie) :expires)]
        (if (is-cookie-expire? (str (get (redis/get-val cookie) :expires)))
          (redis/set-val cookie {:expires expired-time}))
        (redis/set-val cookie {:expires expired-time}))
      (handler (assoc request :session {:cookies cookie})))))

(def app-middleware
  (-> router/app-routers
      wrap-session-expire
      wrap-json-response
      wrap-json-body
      wrap-reload
      wrap-cookies
      wrap-session))
