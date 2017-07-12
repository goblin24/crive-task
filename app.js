/**
 * Created by shubham on 7/11/2017.
 */

var express = require('express');
var app = express();
 var mongoose = require('mongoose');

var routes = require('./app/routes/routes');

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var configDB = require('./config/database');

mongoose.connect(configDB.url , {
    useMongoClient: true }
    ,function (error) {
        if(!error)
            console.log("Connected to Database");
    }
);

app.use(express.static('./public'));

app.use('/',routes);


app.listen(3000,function() {
console.log("Server Running at port 3000")
});
