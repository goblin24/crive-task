/**
 * Created by shubham on 7/11/2017.
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const nodemailer = require('nodemailer');

var adminSchema = new Schema({
    name : String,
    password :String,
    email:String
});

var UserSchema = new Schema({
    name: String,
    email: String,
    img: { data: Buffer, contentType: String },
    description : String,
    city : String,
    instaname : String
});

var User = mongoose.model('User', UserSchema);
var Admin = mongoose.model('Admin', adminSchema);

//
// User.img.data = fs.readFileSync(imgPath);
// User.img.contentType = 'image/png';
// User.save(function (err, user) {
//     if (err) throw err;




var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


router.get('/', function (req , res) {
  res.sendFile('index.html' , { root: path.join(__dirname, '/../../views')});
});



router.get('/login' , function (req,res) {
    res.sendFile('Login.html' ,{ root: path.join(__dirname, '/../../views')});
});


router.get('/signup', function (req , res) {
    res.sendFile('signup.html',{ root: path.join(__dirname, '/../../views')});
});


router.post('/signup', function (req ,res) {
    Admin.create({
        name : req.body.name,
        password :req.body.password,
        email : req.body.email  } ,function (err, admin) {
        if (err) return handleError(err);
    }
    );  res.sendFile('admin_profile.html', { root: path.join(__dirname, '/../../views')});
   });


//  router.post('/signup' ,function (req,res) {
// MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     db.collection('admins').insertOne({
//         "name": req.body.name,
//         "email": req.body.email,
//         "password": req.body.password
//     })
// })
//      res.send("complete");
//
// })


router.post('/adminpage', isLoggedIn , function(req, res, next) {
    res.sendFile('admin_profile.html', { root: path.join(__dirname, '/../../views')});
})



function isLoggedIn(req,res, next) {
    Admin.findOne( {email : req.body.email ,password : req.body.password }).lean().exec( function (err, admin) {
        if(err) {
            console.log(err);
        }
        else if(admin){
           return next();
        }
        else {
            //res.sendFile('Login.html' ,{ root: path.join(__dirname, '/../../views')});
           res.redirect('/login');
            console.log('Invalid Login');
        }
    } )

}

router.post('/create', function (req , res)  {
    User.create({
        "name" : req.body.name,
        "email" : req.body.email,
        "description" : req.body.desc,

        city : req.body.city,
        instaname : req.body.instaname } , function (err, user) {
            if (err) return handleError(err);
        }
    ); res.redirect('/profile/'+req.body.instaname);
});


router.get('/profile/:instaname', FindUser ,function (req,res, next)
{
    //  res.send(req.params.instaname);
   res.sendFile('profile.html', {root: path.join(__dirname, '/../../views')} );
})

function FindUser(req, res, next) {

    var namea = req.params.instaname;
    User.findOne( { instaname :  namea }).exec( function (err, user) {
        if(err) {
            console.log("error");
            res.send(err + req.params.instaname);
        }
        else if(!user){
            console.log("not found"+ req.params.instaname);
            res.redirect('/');
        }
        else {
            console.log("user" + req.params.instaname);
          //  res.json(user);
            return next();
        }
    } )
}

router.get('/profile/:instaname/contact', function (req, res) {
    res.sendFile('contact.html', {root: path.join(__dirname, '/../../views')} );

})


router.post('/sendmail', SendMail, function (req,res) {

})

function SendMail(req,res) {
    var smtpTransport = nodemailer.createTransport('smtps://saintgobs@gmail.com:goblin1994@smtp.gmail.com');
var MailOptions = {
    from: req.body.useremail,
   // to :  ,
    subject : "Hello",
    text : req.body.message
}
    smtpTransport.sendMail(MailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
})
}


module.exports = router;
