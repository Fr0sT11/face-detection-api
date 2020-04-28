const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
/*
const db=knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});*/

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req, res) =>{ res.send('it is working!') })
app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
app.post('/signin',signin.handleSignin(db, bcrypt));//Advanced function but same
app.post('/register',(req,res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id',(req,res) => { profile.handleProfileGet(req, res, db) });
app.put('/image',(req,res) => { image.handleImage(req,res,db) });
app.post('/imageurl',(req,res) => { image.handleApiCall(req,res) });

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

