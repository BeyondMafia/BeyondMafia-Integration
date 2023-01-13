# Setting up the Development Environment: Developer Mode

There are special [permission modes](https://github.com/r3ndd/BeyondMafia-Integration/blob/master/data/constants.js#L248) you can assign yourself. This guide goes through how to let your account enter dev mode.

## Add dev property to your user

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

If you're interested, the property is checked [here](https://github.com/r3ndd/BeyondMafia-Integration/blob/master/Games/core/Game.js#L534).

## Testing games with bots

1. Create and host a setup.

2. A test tube icon appears in the top bar.

![test tube](https://user-images.githubusercontent.com/24848927/212347042-d729e153-5d9c-427c-9732-e1f60e4123d0.png)

3. Click the test tube icon and bot accounts will spawn in new windows.