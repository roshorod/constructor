(ns app.core.element
  (:require [app.core.redis :as redis]))

(defprotocol ElementProtocol
  (create [this])
  (delete [this]
    "Return 0 if not deleted or key empty. 1 if deleted"))

(defrecord Element [id body]
  ElementProtocol
  (create [_]
    (let [element (assoc body :id id)]
      (redis/set-val id element)))
  (delete [_]
    (redis/del-val id)))

(comment
  (create (Element. "test-id" {:test "One" :tow "test"}))
  (delete (Element. "test-id" {:test "One" :tow "test"})))
