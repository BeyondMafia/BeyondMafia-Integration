# Setting up the Development Environment (Github Codespace)

## About Github Codespace

Github Codespace is a cloud workspace where small amounts of code can be executed for free. 

Disclaimer: It is a billable service. You can monitor your usage and billing [here](https://github.com/settings/billing). There will be a section to track your Codespace usage.

![codespace billing](https://user-images.githubusercontent.com/24848927/219879748-0677911b-65bb-4d02-b8e0-873574adaa2e.png)

By default, the spending limit is $0. The monthly quota should be sufficient for light testing of this repository.

## Create a Codespace

1. Create a Codespace from your fork.

![create codespace](https://user-images.githubusercontent.com/24848927/219880024-8414b3e9-656a-4e50-abb6-0d042b5952e8.png)

2. Configure Node. For consistency, this project uses `14.15.1`.

```
nvm install 14.15.1
nvm alias default 14.15.1
```

3. The rest of the setup is consistent with the `README`. The default codespace comes pre-configured with docker, which can be used when setting up Mongo and Redis.

4. For testing games, you need to connect to this codespace using a local VS Code. You will be prompted to install a Github Codespace extension.

![image](https://user-images.githubusercontent.com/24848927/219895626-6e680e8c-49b3-4b67-83cf-5287b3b762c8.png)

The forwarded ports should be on localhost `127.0.0.1` instead of the Github URI. Check that all ports are running on HTTP, which is the default option.

## Important: Stopping Codespace

This repository runs mongo, redis and pm2 services in the background. It can cause your codespace usage to rack up overnight. Remember to shutdown your instance after each development session.

![shutdown](https://user-images.githubusercontent.com/24848927/219884970-e323877b-aeb9-4dbf-bbaf-7c18304353ca.png)
