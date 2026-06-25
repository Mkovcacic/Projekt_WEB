const mongodb = require('mongodb');

const connect_to_db = async () => {
  const url = 'mongodb://127.0.0.1:27017';
  const client = new mongodb.MongoClient(url);
  const dbName = 'cineforum';
  let db;
  try {
    await client.connect();
    console.log('MongoDB: Successfully connected');
  } catch (e) {
    console.log(e);
  }

  db = client.db(dbName);
  return db;
};

module.exports = { connect_to_db };