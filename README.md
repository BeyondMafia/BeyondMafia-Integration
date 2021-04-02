# EpicMafia.org
This is the source code powering [EpicMafia.org](https://epicmafia.org), a non-profit website dedicated to filling the shoes of EpicMafia.com. Contributions are welcome from anyone.

## Contributing
1. Fork the repository
2. Make your changes to your forked repository
3. Open a pull request on the dev branch of this repository
4. If approved and merged, test your changes on https://test.epicmafia.org
5. Dev will be merged into master after changes are tested
6. Perform a final test on the main site after merge into master

## Running the site locally
1. Install node.js (the server uses node 14.15.1)
2. Install MongoDB and Redis and run them as services. If using Windows, install Memurai instead of Redis. 
3. Clone the repository
```bash
git clone https://github.com/epicmafia-community-org/EpicMafia.git
```
4. Install node modules
```bash
cd EpicMafia
npm install
cd react_main
npm install
```
5. Create .env file for the server

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
MONGO_USER=dbuser
MONGO_PW=x
REDIS_DB=0
OAUTH_URL=http://localhost:3000
OAUTH_SUCCESS_REDIR=http://localhost:3001
OAUTH_FAIL_REDIR=http://localhost:3001/signin
DISCORD_CLIENT_ID=x
DISCORD_CLIENT_SECRET=x
TWITCH_CLIENT_ID=x
TWITCH_CLIENT_SECRET=x
GOOGLE_CLIENT_ID=x
GOOGLE_CLIENT_SECRET=x
STEAM_API_KEY=x
SPAM_SUM_LIMIT=15
SPAM_RATE_LIMIT=10
MAX_SETUPS=100
MAX_MSG_LENGTH=240
MAX_TEXT_INPUT_LENGTH=100
PLAYER_LIMIT=50
SPECTATOR_LIMIT=100
AGORA_ID=x
AGORA_CERT=x
```
6. Create a .env file for the React app

Example file:
```
Example file:
PORT=3001
REACT_APP_URL=http://localhost:3000
REACT_APP_SOCKET_URI=localhost
REACT_APP_SOCKET_PROTOCOL=ws
REACT_APP_USE_PORT=true
REACT_APP_AGORA_ID=f366ac8a8daa4be5bd04700e89b5e1ac
```
7. Start the server processes and the React dev server
```
cd EpicMafia
npm start
cd react_main
npm start
```

## Role and game creation
Detailed documentation for role/game creation coming soon.