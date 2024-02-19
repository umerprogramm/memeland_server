const express = require('express')
let cors = require('cors')
const { MongoClient } = require('mongodb')
const bodyparser = require('body-parser')  
const app = express()
app.use(cors())
app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json())

const uri = 'mongodb+srv://umer:save123@cluster0.frxypxa.mongodb.net/MemeLand?retryWrites=true&w=majority'
const client = new MongoClient(uri)

async function connectToDatabase() {
    try {
      await client.connect();
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
    }
  }
  
  connectToDatabase();

app.post('/register',async(req ,res)=>{
  const fname = req.body.fname
  const email = req.body.email
  const pass = req.body.pass
  const database = client.db('MemeLand');
 await database.collection('user').insertOne({
    full_name : fname,
    email : email,
  password : pass,

  });


    console.log(fname , email , pass);
    res.send('your form has been submitted')
})  


  app.get('/posts', async (req, res) => {
    const database = client.db('MemeLand');
    const doc = await database.collection('posts').find({}).toArray();
    res.json(doc);
  });
  
app.post('/login' , async (req ,res)=>{
  const email = req.body.email
  const pass = req.body.pass
  const database = client.db('MemeLand');
  const doc = await database.collection('user').findOne({
    email : email
  });

  if(doc.password == pass){
    res.send({
      status : true,
      info : doc
    })
  }else {
    res.send({
      status : false
    })
  }
  




})

app.post('/upload_image' , async (req ,res)=> {
  let url = req.body.url
  let caption = req.body.caption
  let username= req.body.username
  const database = client.db('MemeLand');
  const doc = await database.collection('posts').insertOne({
    channel_name : username,
    post : url,
    like : 0,
    caption
  })
 console.log(doc);
  res.send('data sended')
      
})

app.listen(5000 , function(){
  console.log('server is running...')
})