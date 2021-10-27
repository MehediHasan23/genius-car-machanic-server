const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()

//port
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())
//genius
//J9FXsUHFjfZN2kCS
//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mil2w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`


//client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// function
async function run(){

  try{
    await client.connect();
    

    const database = client.db("carMechanic");
    const servicesCollection = database.collection('services')

    // get api 
    app.get('/services', async(req, res) =>{
      const cursor = servicesCollection.find({})
      const services = await cursor.toArray()
      res.send(services)
    })


    //get single item

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id
      console.log("hitted the id", id);
      const query = {_id: ObjectId(id)}
      const result = await servicesCollection.findOne(query)
      res.json(result)
    })

    // post api 
    app.post('/services', async(req, res) =>{
      const service = req.body
      const result = await servicesCollection.insertOne(service)
      console.log('hitting post api', service);
      console.log(result);
      res.json(result)

    })

    //delete api
    app.delete('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await servicesCollection.deleteOne(query)
      res.json(result);
    })
    
    
  }
  finally {
    // await client.close();
  }



}
run().catch(console.dir)

//get
app.get('/', (req, res)=>{
  res.send('hello from node_express')
})

app.listen(port, ()=>{
  console.log('running port', port);
})