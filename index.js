const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const sha1 = require('sha1');

const MongoClient = require('mongodb').MongoClient;

const CONNECTION_URL =
  'mongodb+srv://barbara:elegantuniverse@cluster0-u2grb.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'todo';
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/person', (req, res) => {
  const username = req.body.username;
  const password = sha1(req.body.password);
  const projects = [];
  const record = { username, password, projects };

  collection.findOne({ username }, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (result) {
      return res.status(403).send('Username already taken');
    } else {
      collection.insert(record, (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.send(result.result);
      });
    }
  });
});

app.post('/person/:username', (req, res) => {
  collection.findOne({ username: req.params.username }, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (result === null) {
      return res.status(403).send('Wrong username');
    }
    const receivedPassword = sha1(req.body.password);
    const storedPassword = result.password;

    if (receivedPassword === storedPassword) res.send(result);
    else return res.status(403).send('Wrong password');
  });
});

app.get('/person/:username', (req, res) => {
  collection.findOne({ username: req.params.username }, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(JSON.stringify(result.projects));
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
