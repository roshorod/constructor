(ns app.component.element
  (:require [ring.util.response :refer [response]]
            [clojure.data.json :refer [read-str]]
            [app.core.session :refer [start-session]]
            [app.context.element :as context]
            [app.core.redis :as redis]))


(defn element-post-by-id [request]
  (let [body (get-in (read-str (slurp (:body request))) ["element"])
        sessoin-id (get (:params request) :session-id)
        element-id (get (:params request) :element-id)
        element (context/serialize-element body)]
    (if (start-session sessoin-id)
      (do
        (context/store-element-record element-id element)
        {:status 201})
      {:status 404})))

(defn element-post [request]
  (let [body       (get-in (read-str (slurp (:body request))) ["element"])
        element    (context/serialize-element body)
        session-id (:session-id (:params request))]
    (if (start-session session-id)
      {:body   {:id (context/store-element session-id element)}
       :status 201}
      {:status 404})))

(defn element-get [request]
  (let [session-id  (:session-id (:params request))
        elements-id (get (redis/get-val session-id) :elements)]
    (if (start-session session-id)
      (response
        (reduce
          into []
          (map
            (fn [element-id]
              [(-> (redis/get-val element-id))])
            elements-id)))
       {:status 401})))
