#Build client (development)
1. `cd client`
2. `npm run start`

#Build client (production)
1. `cd client`
2. `npm run build`
3. Change the index.html file in client/static/assets to point to bundle.min.js


#Build and run server
1. build client
2. `cd server`
3. `mvn clean install`
4. `java -Djava.exts.dirs=lib/ -jar target/mediaserver-1.0-SNAPSHOT.jar --mediadir=<path to your media>`

Then open your browser to `127.0.0.1:8080`