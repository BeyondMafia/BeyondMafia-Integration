# BeyondMafia Ultimate Setup and Beginner Contribution Guide

## Step 1: Setup Github and Fork

1. Create a Github account.

2. Fork the repository from the top right of this page. You will make edits to your personal fork, and then make a request for your changes to be accepted into the master copy.

## Step 2: Setup Github Codespace

### About Github Codespace

Github Codespace is a cloud workspace where small amounts of code can be executed for free. Disclaimer: It is a billable service. You can monitor your usage and billing [here](https://github.com/settings/billing). There will be a section to track your Codespace usage.

![codespace billing](https://user-images.githubusercontent.com/24848927/219879748-0677911b-65bb-4d02-b8e0-873574adaa2e.png)

By default, the spending limit is $0 so you won't be charged. The monthly quota should be sufficient for light testing of this repository.

### Create a Codespace

1. Create a Codespace from your fork.

![create codespace](https://user-images.githubusercontent.com/24848927/219880024-8414b3e9-656a-4e50-abb6-0d042b5952e8.png)

2. Configure node in the codespace terminal. For consistency, this project uses `14.15.1`.

```
nvm install 14.15.1
nvm alias default 14.15.1
```

3. Download [Visual Studio Code (VS Code)](https://code.visualstudio.com/download).

4. Connect to this codespace using VS Code. You will be prompted to install a Github Codespace extension.

![image](https://user-images.githubusercontent.com/24848927/219895626-6e680e8c-49b3-4b67-83cf-5287b3b762c8.png)

### Important: Stopping Codespace

This repository runs mongo, redis and node services in the background. It can cause your codespace usage to rack up overnight. You can shutdown your instance after each development and testing session.

![shutdown](https://user-images.githubusercontent.com/24848927/219884970-e323877b-aeb9-4dbf-bbaf-7c18304353ca.png)

### Step 3: Install Mongo and Redis

1. Run the mongo container.

```
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -v local-mongo:/data/db --name mongo --restart=always mongo
```

2. Enter the mongo shell.

```
docker exec -it mongo mongosh
```

3. Authenticate as admin. The default password (configured in Step `3.1`) is `password`.

```
test> use admin
switched to db admin

admin> db.auth('admin', passwordPrompt())
Enter password
********{ ok: 1 }

admin> 
```

4. Create a database.

```
admin> use beyondmafia
switched to db beyondmafia
```

5. Exit the mongo shell.

```
beyondmafia> exit
```

6. Run the redis container
```
docker run -d -p 6379:6379 --name redis --restart=always redis
```

### Step 4: Install node modules

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

### Step 5: Environment Variables

1. Create `.env` file for the server under `BeyondMafia-Integration/.env`, and copy this [example file](/docs/server_env)

2. Create a `.env` file for the React app under `BeyondMafia-Integration/react_main/.env` and copy this [example file](/docs/client_env)

3. Refer to [this guide](/docs/setup-dependencies.md) for retrieving your own test API keys for Firebase and reCAPTCHA.

### Step 6: Start the Site

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

The forwarded ports should be on localhost `127.0.0.1` instead of the Github URI. Check that all ports are running on HTTP, which is the default option.

You can now view your test site, and create your own test account. This account is not affiliated to `beyondmafia.com`. If your email domain is not accepted, look for the email section in both `.env` files.

### Step 7: Setting up Bot Games

To play games with bots, we need to add the `dev` property to your user. Make sure that you first create an account on your test site.

1. Enter the mongo shell via `mongosh`.

```
docker exec -it mongo mongosh
```

2. Authenticate as admin.

```
test> use admin
switched to db admin

admin> db.auth('admin', passwordPrompt())
Enter password
********{ ok: 1 }

admin> 
```

3. Enter the beyondmafia db (`$MONGO_DB`).


```
admin> use beyondmafia
switched to db beyondmafia
```

5. Add the dev property to your user.

```
beyondmafia> db.users.updateOne( 
    { name: '<username>' }, 
    { $set: {dev: 'true'} })

{
  acknowledged: true,
  modifiedCount: 1
}
```

6. Check that your user has the dev property.

```
beyondmafia> db.users.find({}, {name:1, dev:1})
[
  {
    _id: ObjectId('XXX'),
    name: '<username>',
    dev: 'true'
  }
]
```

#### Testing games with bots

1. Create and host a setup.

2. A test tube icon appears in the top bar.

![test tube](https://user-images.githubusercontent.com/24848927/212348802-56db2540-5b3d-4c72-8182-3ab883eed99c.png)

3. Click the test tube icon and bot accounts will spawn in new windows. Remember to enable pop-up windows in your browser.

#### (Optional) Set as Owner

Owner permissions are not needed for testing roles but it will come in handy to test other site functions like forum and chat.

1. Get your user ObjectId.

```
beyondmafia> db.users.find({}, {name:1})
```

2. Get the group ObjectId.

```
beyondmafia> db.groups.find({name:'Owner'}, {name:1})
```

3. Add the group mapping.

```
beyondmafia> db.ingroups.insert(
  {
    user: ObjectId("6XXXuserId"),
    group: ObjectId("6YYYgroupId")
  })
```