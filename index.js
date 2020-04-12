const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const sha1 = require('sha1');

const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectID;

const CONNECTION_URL =
  'mongodb+srv://barbara:elegantuniverse@cluster0-u2grb.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'todo';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.post('/person', (req, res) => {
  const username = req.body.username;
  const password = sha1(req.body.password);
  const projects = [];
  const record = { username, password, projects };

  collection.insert(record, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(result.result);
  });
});

app.get('/person/:username', (req, res) => {
  collection
    .find({ username: req.params.username })
    .toArray((error, result) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.send(JSON.stringify(result[0].projects));
    });
});

app.post('/person/:username', (req, res) => {
  collection.findOne({ username: req.params.username }, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    const receivedPassword = sha1(req.body.password);
    const storedPassword = result.password;

    if (receivedPassword === storedPassword) res.send(result);
    else return res.status(403).send('Wrong password');
  });
});

app.post('/person/:username/projects', (req, res) => {
  collection.findOneAndUpdate(
    { username: req.params.username },
    { $set: { projects: req.body } },
    (error, result) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.send(result);
    }
  );
});

app.get('/people', (req, res) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(result);
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection('users');
      console.log('Connected to `' + DATABASE_NAME + '`!');
    }
  );
});
