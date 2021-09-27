(ns app.component.element
  (:require [ring.util.response :refer [response]]
            [clojure.data.json :refer [read-str]]
            [app.core.session :refer [start-session]]
            [app.context.element :as context]
            [app.core.redis :as redis]))


(defn element-post [request]
  (let [body       (get-in (read-str (slurp (:body request))) ["element"])
        element    (context/serialize-element body)
        session-id (:session-id (:params request))]
    (if (start-session session-id)
      (do (context/store-element
            session-id element)
          {:status 201})
      {:status 404})))

(defn element-get [request]
  (let [session-id (:session-id (:params request))]
    (if (start-session session-id)
      (response
        (reduce
          into []
          (map (fn [element]  (next element))
               (:elements (redis/get-val session-id)))))
       {:status 401})))
