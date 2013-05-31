var express = require('express'),
	routes = require('./routes'),
  api = require('./routes/api'),
  swagger = require("swagger-node-express"),
  lessMiddleware = require('less-middleware');
 
var app = module.exports = express.createServer();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.methodOverride());
    app.use(lessMiddleware({src : __dirname + "/public", compress : true }));
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
      layout: false
    });
   
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/frisb', api.findAll);
app.get('/frisb/:id', api.findById);
app.post('/frisb', api.addFrisb);
app.put('/frisb/:id', api.updateFrisb);
app.delete('/frisb/:id', api.deleteFrisb);
 
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

console.log('Listening on port 3000...');





///////////////////////SWAGGER/////////////////////////////////////////
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
