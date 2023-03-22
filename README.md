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

> If you don't have a working dev environment, you can check out [this guide](/docs/setup-github-codespace.md) for running the code remotely on Github Codespaces.

#### Prerequisites

1. Install node.js, and set the version to `v14.15.1`.

2. Install MongoDB and Redis and run them as services. If using Windows, install Memurai instead of Redis. You can refer to [this guide](/docs/setup-mongo-redis-docker.md) for setting up MongoDB and Redis via docker.

3. Clone your forked repository. Replace "r3ndd" with your github username.

```bash
git clone https://github.com/r3ndd/BeyondMafia-Integration.git
```

#### Install node modules

1. Install pm2 globally.

```bash
npm i -g pm2
```

2. Install backend node modules.

```bash
cd BeyondMafia-Integration 
npm install
```

3. Install frontend node modules.
```bash
cd react_main
npm install
```

#### Setup environment variables

1. Create `.env` file for the server under `BeyondMafia-Integration/.env`, and copy this [example file](/docs/server_env)

2. Create a `.env` file for the React app under `BeyondMafia-Integration/react_main/.env` and copy this [example file](/docs/client_env)

3. Refer to [this guide](/docs/setup-dependencies.md) for retrieving your own test API keys for Firebase and reCAPTCHA.

#### Start the site

1. Start the backend server
```
cd BeyondMafia-Integration 
npm start
```

2. Start the frontend React app
```
cd react_main
npm start
```

## Role and game creation

- [Role Creation Guide](/docs/guide-role-creation.md)
- [Role Icon Guide](/docs/guide-role-icons.md)

Detailed documentation for role/game creation coming soon.