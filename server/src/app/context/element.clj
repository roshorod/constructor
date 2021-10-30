(ns app.context.element
  (:require [app.core.redis :as redis]
            [taoensso.timbre :as log]))


(defn store-element-record
  "Write element into store."
  [element-id element]
  (let [element-with-id (assoc element :id element-id)]
    (if (nil? (redis/get-val element-id))
      (redis/set-val element-id element-with-id)
      (do
        (log/warn "Current element id:" element-id "rewrited. May be incorect id")
        (redis/set-val element-id element-with-id)))))

(defn ^:private append-element
  "Append element id in `:elements' and save it to store.
  And call `store-element-record to save element into store.'"
  [session-id element]
  (let [store-session (redis/get-val session-id)
        session       (if (nil?
                            (get store-session :elements))
                        (assoc store-session :elements [])
                        store-session)]
    (let [elements   (get session :elements)
          element-id (str session-id (count elements))]
      (store-element-record element-id element)
      (redis/set-val
        session-id
        (assoc session :elements (conj elements element-id)))
      element-id)))

(defn make-element
  [{:keys [id tag content position]}]
  {:id       id
   :tag      tag
   :content  content
   :position position})

(defn serialize-element [string]
  (let [id       (get-in string ["id"])
        tag      (get-in string ["tag"])
        content  (get-in string ["content"])
        position (get-in string ["spawnPosition"])
        cords    (get-in string ["cords"])
        color    (get-in string ["color"])]
    {:id       id
     :tag      tag
     :content  content
     :position position
     :cords    cords
     :color    color}))

(defn store-element
  "Top level function for store element in redis."
  [session-id element]
  (append-element session-id element))
