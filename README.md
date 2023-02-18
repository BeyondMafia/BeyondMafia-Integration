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

> If you're not able to run it locally, check out [this guide](/docs/github-codespace.md) for running the code remotely on Github Codespaces for free.

1. Install node.js (the server uses node 14.15.1)

2. Install MongoDB and Redis and run them as services. If using Windows, install Memurai instead of Redis. You can refer to [this guide](/docs/mongo-redis-docker.md) for setting up MongoDB and Redis via docker.

3. Install pm2
```bash
npm i -g pm2
```

4. Clone your forked repository. Replace "r3ndd" with your github username.

```bash
git clone https://github.com/r3ndd/BeyondMafia-Integration.git
```

5. Install the node modules
```bash
cd BeyondMafia-Integration 
npm install
cd react_main
npm install
```

6. Create `.env` file for the server under `BeyondMafia-Integration/.env`, and copy this [example file](/docs/server_env)

7. Create a `.env` file for the React app under `BeyondMafia-Integration/react_main/.env` and copy this [example file](/docs/client_env)

8. Refer to [this guide](/docs/dependencies.md) for retrieving your own test API keys for Firebase and reCAPTCHA.

9. Start the server processes and the React dev server
```
cd BeyondMafia-Integration 
npm start
cd react_main
npm start
```

## Role and game creation

- [Role Creation Guide](/docs/role-creation-guide.md)
- [Role Icon Guide](/docs/role-icons.md)
Detailed documentation for role/game creation coming soon.