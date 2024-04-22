import { MongoClient } from "mongodb";

let dbConnection;

let db = {
  connectToDb(cb) {
    MongoClient.connect("mongodb://localhost:27017/oa")
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((error) => {
        console.log(error);
        return cb(error);
      });
  },
  getDb() {
    return dbConnection;
  },
};

export default db;
