# BeyondMafia 
This is the source code powering [BeyondMafia.com](https://beyondmafia.com), a website built to fill the shoes of EpicMafia.com. Contributions are welcome from anyone.

## Contributing
1. Fork the repository
2. Make your changes to your forked repository
3. Open a pull request on the dev branch of this repository
4. If approved and merged, test your changes on https://test.beyondmafia.com
5. Dev will be merged into master after changes are tested
6. Perform a final test on the main site after merge into master

## Running the site locally
1. Install node.js (the server uses node 14.15.1)
2. Install MongoDB and Redis and run them as services. If using Windows, install Memurai instead of Redis. 
3. Install pm2
```bash
npm i -g pm2
```
4. Clone the repository
```bash
git clone https://github.com/Giga1396/BeyondMafia-Integration.gitt
```
5. Install the node modules
```bash
cd BeyondMafia-Integration 
npm install
cd react_main
npm install
```
6. Create .env file for the server

Example file:
```
NODE_ENV=development
PORT=3000
UPLOAD_PATH=uploads
BASE_URL=http://localhost:3001

GAME_PORTS=[3010]
CHAT_PORT=2999
SOCKET_PING_INTERVAL=10000
SERVER_SOCKET_PING_INTERVAL=2000
GAME_CREATION_TIMEOUT=5000

SESSION_SECRET=x
LOAD_BALANCER_KEY=x
BOT_SECRET=x
BOT_KEY=x

MONGO_URL=localhost
MONGO_DB=dbname
MONGO_USER=admin
MONGO_PW=x

REDIS_DB=0

FIREBASE_API_KEY=x
FIREBASE_AUTH_DOMAIN=x.firebaseapp.com
FIREBASE_PROJECT_ID=x
FIREBASE_MESSAGING_SENDER_ID=x
FIREBASE_APP_ID=x
FIREBASE_MEASUREMENT_ID=x

AGORA_ID=x
AGORA_CERT=x

IP_API_URL=https://ipqualityscore.com/api/json/ip
IP_API_KEY=x
IP_API_PARAMS=strictness=0&allow_public_access_points=true&fast=true&lighter_penalties=true&mobile=true

RESERVED_NAMES={}
```
6. Create a .env file for the React app

Example file:
```
PORT=3001
REACT_APP_URL=http://localhost:3000
REACT_APP_SOCKET_URI=localhost
REACT_APP_SOCKET_PROTOCOL=ws
REACT_APP_USE_PORT=true

REACT_APP_AGORA_ID=x

REACT_APP_FIREBASE_API_KEY=x
REACT_APP_FIREBASE_AUTH_DOMAIN=x.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=x
REACT_APP_FIREBASE_STORAGE_BUCKET=x.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=x
REACT_APP_FIREBASE_APP_ID=x
REACT_APP_FIREBASE_MEASUREMENT_ID=x
```
7. Start the server processes and the React dev server
```
cd BeyondMafia-Integration 
npm start
cd react_main
npm start
```

## Role and game creation
Detailed documentation for role/game creation coming soon.