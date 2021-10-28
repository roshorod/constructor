(defproject constructor "0.0.0"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.10.3"]
                 [org.clojure/data.json "2.4.0"]
                 [ring "1.9.4"]
                 [ring/ring-json "0.5.1"]
                 [compojure "1.6.2"]
                 [http-kit "2.6.0-alpha1"]
                 [hiccup "2.0.0-alpha2"]
                 [mount "0.1.16"]
                 [environ "1.2.0"]
                 [clj-time "0.15.2"]
                 [com.taoensso/carmine "3.2.0-alpha1"]]
  :plugins [[lein-environ "1.2.0"]]
  :main app.server
  :profiles {:dev        {:env {:redis-uri "redis://localhost:6379"}}
             :production {:env {:redis-uri "redis://127.0.0.1:6379"}}
             :uberjar {:aot :all}}
  :uberjar-name "constructor.jar")
