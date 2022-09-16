const mongoose = require("mongoose");

module.exports = {
    promise: new Promise(async (resolve, reject) => {
        // await mongoose.connect(`mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}?authSource=admin`, {
        //     user: process.env.MONGO_USER,
        //     pass: process.env.MONGO_PW,
        //     useNewUrlParser: true
        // });
        await mongoose.connect(`mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}`);

        resolve(mongoose.connection);
    }),
    conn: mongoose.connection
};