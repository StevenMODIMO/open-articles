import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let dbConnection;

let db = {
  connectToDb(cb) {
    MongoClient.connect(process.env.MONGO_URI)
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
