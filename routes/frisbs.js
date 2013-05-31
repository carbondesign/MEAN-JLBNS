var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('frisbdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'frisbdb' database");
        db.collection('frisb', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'frisb' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving frisb: ' + id);
    db.collection('frisb', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('frisb', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addFrisb = function(req, res) {
    var frisb = req.body;
    console.log('Adding frisb: ' + JSON.stringify(frisb));
    db.collection('frisb', function(err, collection) {
        collection.insert(frisb, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateFrisb = function(req, res) {
    var id = req.params.id;
    var frisb = req.body;
    console.log('Updating frisb: ' + id);
    console.log(JSON.stringify(frisb));
    db.collection('frisb', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, frisb, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating frisb: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(frisb);
            }
        });
    });
}
 
exports.deleteFrisb = function(req, res) {
    var id = req.params.id;
    console.log('Deleting frisb: ' + id);
    db.collection('frisb', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var frisb = [
    {
        name: "wireframing",
        description: "creating code blueprints",
        need: "60"
    },
    {
        name: "css3",
        description: "can write awesome code",
        need: "20"
    }];
 
    db.collection('frisb', function(err, collection) {
        collection.insert(frisb, {safe:true}, function(err, result) {});
    });
 
};