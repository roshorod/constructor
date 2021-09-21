(ns app.context.element
  [:require [app.core.redis :as redis]])


(defn make-element
  [{:keys [id tag content position]}]
  {:id      id
   :tag     tag
   :content content
   :position position})

(map (fn [x] (assoc (val x) :child nil))
     {(make-element {:id 1 :tag "h1" :content "test content"})
      (make-element {:id 1 :tag "h1" :content "test last"})})

(get (make-element {:id 2 :tag "h2"}) :tag)

(:id (make-element {:id 3 :tag "h3"}))
