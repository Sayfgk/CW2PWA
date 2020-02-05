// load Express.js
const express = require('express') 
const app = express()

// load bodyParser module for json payload parsing
const bodyParser = require('body-parser') 
app.use(bodyParser.json())

// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
        db = client.db('afterschool')  
    })

// get the collection name
app.param('lessons', (req, res, next, collectionName) => { req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
    })    

// get the collection name
app.param('users', (req, res, next, collectionName) => { req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
    })    

    // dispaly a message for root path to show that API is working
app.get('/', function (req, res) {
    res.send('Select a collection, e.g., /collections/messages')
    })

    // retrieve all the objects from an collection
app.get('/collections/:collectionName', (req, res) => {
    req.collection.find({}, { limit: 5, sort: [['price', -1]] }).toArray((e, results) => {
            if (e) return next(e)
            res.send(results) 
        })
    })

    // add a lesson
app.post('/collections/:collectionName', (req, res, next) => { 
    // TODO: Validate req.body 
    req.collection.insert(req.body, (e, results) => {
            if (e) return next(e)
            res.send(results.ops) 
        })
    })

    // retrieve a lesson by mongodb ID
const ObjectID = require('mongodb').ObjectID; 
app.get('/collections/:collectionName/:id', (req, res, next) => {
    console.log('searching json object with id:', req.params.id) 
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e)
    res.send(result) 
        })
    })

// update a lesson by ID
app.put('/collections/:collectionName/:id', (req, res, next) => {
req.collection.update({ _id: new ObjectID(req.params.id) },
{ $set: req.body },
{ safe: true, multi: false }, (e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
            })
        })

        app.listen(3000)