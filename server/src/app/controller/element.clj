(ns app.controller.element
  (:require [clojure.data.json :as json]
            [aleph.http :as aleph]
            [manifold.stream :as stream]
            [manifold.deferred :as defer]
            [taoensso.timbre :as log]
            [app.core.session :as session :refer [->Session]]
            [app.core.element :as element :refer [->Element]]))

;; {"session": "test", "type":"get-all"}
;; {"session": "test", "element":{"id": "test1", "color":"red"}, "type":"create"}
;; {"session": "test", "element":{"id": "test1", "color":"gray"}, "type":"update"}
;; {"session": "test", "element":{"id": "test1"}, "type":"delete"}
;; delete session and recur elements
;; {"session": "test", "type":"delete"}
(defn element-ws-handler [req]
  (-> (aleph/websocket-connection req)
      (defer/chain'
        (fn [conn]
          (stream/consume
            (fn [msg]
              (let [req-msg   (try (json/read-json msg)
                                   (catch Exception _ :exception))
                    type      (get req-msg :type)
                    obj->elem (get req-msg :element)]
                (cond

                  (= type "get-all")
                  (let [session (->Session (get req-msg :session))]
                    (try
                      (if (session/contains-elements? session)
                        (stream/put! conn (json/write-str
                                            {:status   200
                                             :elements (session/get-elements session)}))
                        (stream/put! conn (json/write-str {:status 204})))
                      (catch Exception e
                        (log/info e)
                        (stream/put! conn (json/write-str {:status 500})))))

                  (= type "create")
                  (let [session (->Session (get req-msg :session))
                        element (->Element (:id obj->elem) obj->elem)]
                    (try
                      (if (session/created? session)
                        (session/append-element session element)
                        (do (session/create session)
                            (session/append-element session element)))
                      (stream/put! conn (json/write-str {:status 201}))
                      (catch Exception e
                        (log/info e)
                        (stream/put! conn (json/write-str {:status 500})))))

                  (= type "update")
                  (let [session (->Session (get req-msg :session))
                        element (->Element (:id obj->elem) obj->elem)]
                    (try
                      (if (session/created? session)
                        (element/create element) ;; recreate
                        (throw (Exception. "Not found session for" session)))
                      (stream/put! conn (json/write-str {:status 200}))
                      (catch Exception e
                        (log/info e)
                        (stream/put! conn (json/write-str {:status 304})))))

                  (= type "delete")
                  (let [session (->Session (get req-msg :session))
                        element (if (empty? obj->elem) nil
                                    (->Element (:id obj->elem) obj->elem))]
                    (try
                      (if (session/created? session)
                        (if (empty? element)
                          (session/delete session)
                          (session/delete-element session element))
                        (throw (Exception. "Not found session for" session)))
                      (stream/put! conn (json/write-str {:status 200}))
                      (catch Exception e
                        (log/info e)
                        (stream/put! conn (json/write-str {:status 204})))))

                  :else
                  (do
                    (stream/put! conn (json/write-str {:status 501}))
                    (log/info "Bad request string")))))
            conn))
        req)
      (defer/catch
          (fn [_]
            'app.router/bad-ws-request))))
