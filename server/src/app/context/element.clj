(ns app.context.element
  (:require [app.core.redis :as redis]
            [taoensso.timbre :as log]))


(defn ^:private store-element-record
  "Write element into store."
  [element-id element]
  (if (nil? (redis/get-val element-id))
    (redis/set-val element-id element)
    (do
      (log/warn "Current element id:" element-id "rewrited. May be incorect id")
      (redis/set-val element-id element))))

(defn ^:private append-element
  "Append element id in `:elements'.
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
      (assoc session :elements (conj elements element-id)))))

(defn make-element
  [{:keys [id tag content position]}]
  {:id       id
   :tag      tag
   :content  content
   :position position})

(defn serialize-element [string]
  (let [tag      (get-in string ["tag"])
        content  (get-in string ["content"])
        position (get-in string ["spawnPosition"])]
    {:element {:tag      tag
               :content  content
               :position position}}))

(defn store-element
  "Top level function for store element in redis."
  [session-id element]
  (redis/set-val
    session-id
    (append-element session-id element)))
