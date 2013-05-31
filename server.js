var express = require('express'),
	url = require("url"),
    frisb = require('./routes/frisbs'),
    swagger = require("swagger-node-express");
 
var app = express();
 
app.get('/frisb', frisb.findAll);
app.get('/frisb/:id', frisb.findById);
app.post('/frisb', frisb.addFrisb);
app.put('/frisb/:id', frisb.updateFrisb);
app.delete('/frisb/:id', frisb.deleteFrisb);
 

console.log('Listening on port 3000...');

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

swagger.setAppHandler(app);

var findById = {
  'spec': {
    "description" : "Operations about pets",
    "path" : "/pet.{format}/{petId}",
    "notes" : "Returns a pet based on ID",
    "summary" : "Find pet by ID",
    "method": "GET",
    "params" : [swagger.pathParam("petId", "ID of pet that needs to be fetched", "string")],
    "responseClass" : "Pet",
    "errorResponses" : [swagger.errors.invalid('id'), swagger.errors.notFound('pet')],
    "nickname" : "getPetById"
  },
  'action': function (req,res) {
    if (!req.params.petId) {
      throw swagger.errors.invalid('id'); }
    var id = parseInt(req.params.petId);
    var pet = petData.getPetById(id);

    if(pet) res.send(JSON.stringify(pet));
    else throw swagger.errors.notFound('pet');
  }
};

swagger.addGet(findById);

swagger.configure("http://petstore.swagger.wordnik.com", "0.1");

app.listen(3000);
