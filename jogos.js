const MongoClient = require('mongodb').MongoClient;

const dbusr = process.env.LTDB_USR;
const dbpasswd = process.env.LTDB_PASSWD;

const url = `mongodb://${dbusr}:${dbpasswd}@ds053607.mlab.com:53607/ltdb`;

const dbName = 'ltdb';
let db = null;

MongoClient.connect(url, function (err, client) {
    if (err) return console.log(err);
    console.log("Connected successfully to server");
    db = client.db(dbName);

    db.collection('mega').find({ "concurso": { "$gte": 1036 } }).toArray((err, results) => {
        results.forEach(element => {
            console.log(element);
        });
    });

});


