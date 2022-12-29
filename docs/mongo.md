# Setting up the Development Environment: MongoDB

There are many ways you can bootstrap MongoDB locally.

## windows

## linux

## docker

This method runs MongoDB in a container. Prerequisites: [docker](https://docs.docker.com/get-docker/).

1. Run the mongo container.

```
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -v local-mongo:/data/db --name mongo --restart=always mongo
```

2. Enter the mongo shell.

```
docker exec -it mongo mongosh
```

3. Authenticate as admin.

```
test> use admin
switched to db admin

admin> db.auth("admin", passwordPrompt())
Enter password
********{ ok: 1 }

admin> 
```

4. Create a database.

```
admin> use beyondmafia
switched to db beyondmafia

beyondmafia> 
```

5. Fill in the `.env` for the backend.

```
MONGO_URL=localhost
MONGO_DB=beyondmafia
MONGO_USER=admin
MONGO_PW=password
```

8. If you need to delete mongo (skip for now!)

```
docker rm -f mongo
docker volume prune
```