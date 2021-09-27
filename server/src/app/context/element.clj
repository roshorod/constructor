(ns app.context.element
  (:require [app.core.redis :as redis]
            [taoensso.timbre :as log]))

(defn ^:private append-element [element-map element]
  (let [elements (get element-map :elements)]
    (assoc element-map :elements
           (into (map (fn [elem] elem) elements)
                 (map (fn [elem] elem) element)))))

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

(def id-generator
  (let [counter (ref 0)]
    (fn [] (dosync (let [cur-val @counter]
                     (do (alter counter + 1)
                         cur-val))))))

(defn store-element
  [session-id element]
  (let [session (redis/get-val session-id)]
    (if (contains? session :elements)
      (redis/set-val session-id (append-element session element))
      (redis/set-val session-id (assoc session :elements (into [] element))))))
