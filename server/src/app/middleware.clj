(ns app.middleware
  (:require [ring.middleware.reload :refer [wrap-reload]]
            [ring.middleware.params :refer [wrap-params]]
            [app.router :as router]))

(def cors-headers
  {"Access-Control-Allow-Origin"  "*"
   "Access-Control-Allow-Headers" "*"
   "Access-Control-Allow-Credentials" "*"
   "Access-Control-Allow-Methods" "GET, POST"})

(defn preflight?
  [request]
  (= (request :request-method) :options))

(defn wrap-cors
  [handler]
  (fn [request]
    (if (preflight? request)
      {:status  200
       :headers cors-headers
       :body    "preflight complete"}
      (let [response (handler request)]
        (update-in response [:headers]
                   merge cors-headers )))))

(def app-middleware
  (-> router/app-routers
      wrap-params
      wrap-reload
      wrap-cors))
