(ns app.component.element
  (:require [ring.util.response :refer [response]]
            [app.context.element :as context]))


(defn element-get [request]
  (let [store (context/make-element {:id 1
                                     :tag "h4"
                                     :content "Elem from server"
                                     :position "Center"})]
    (response {:element store})))
