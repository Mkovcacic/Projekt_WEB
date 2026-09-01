const mongodb = require('mongodb');
require('dotenv').config();

let client;
let db;
let connectionPromise = null;

const connect_to_db = async () => {
  if (db) {
    return db;
  }

  if (!connectionPromise) {
    const client = new mongodb.MongoClient(process.env.MONGODB_URL);

    connectionPromise = client
      .connect()
      .then(() => {
        db = client.db('cineforum');
        console.log('MongoDB: Successfully connected)');
        return db;
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }

  return connectionPromise;
};

module.exports = { connect_to_db };