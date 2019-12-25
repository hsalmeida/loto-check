const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const dbusr = process.env.LTDB_USR;
const dbpasswd = process.env.LTDB_PASSWD;
const port = process.env.PORT || 80;

const url = `mongodb://${dbusr}:${dbpasswd}@ds053607.mlab.com:53607/ltdb`;

const dbName = 'ltdb';
let db = null;

app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static('public'));

app.set('json spaces', 4);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});

app.use(compression());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    if (err) return console.log(err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
});


app.get('/api/1/databases/ltdb/collections/:collection', (req, res) => {
    let collection = req.params.collection
    db.collection(collection).find().toArray((err, results) => {
        if (err) return console.log(err)
        res.json(results);
    })
})

app.post('/api/1/databases/ltdb/collections/:collection', (req, res) => {
    let collection = req.params.collection
    let body = req.body;
    db.collection(collection).save(body, (err, result) => {
        if (err) return console.log(err)
        console.log('salvo no banco');
        res.sendStatus(201);
    })
})

app.put('/api/1/databases/ltdb/collections/:collection/:id', (req, res) => {
    let collection = req.params.collection
    let id = req.params.id
    let body = req.body;
    db.collection(collection).updateOne({_id: ObjectId(id)}, { $set: { body } }, (err, result) => {
        if (err) return console.log(err)
        console.log('salvo no banco');
        res.send(200).json(result);
    })
})


//https://api.mlab.com/api/1/databases/ltdb/collections/mega?apiKey=YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh&l=3000