const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

const dbName = process.env.DB_NAME;
const app = express()
const port = 3000

app.use(express.json()); // This is required to parse JSON body
app.use(bodyparser.json());
app.use(cors());


// Get all the passwords
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

// Save a password
app.post('/', async (req, res) => { 
  const password = req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  res.send({success: true, result: findResult})
})

//  Delete a password
app.delete('/', async (req, res) => { 
  const password = req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.deleteOne(password);
  res.send({success: true, result: findResult})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})