var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
    res.render('addcategory',{
      'title':'Add Category',
    });
});

router.post('/add', function(req, res, next) {
  //Get form values
  var name=req.body.name;

  req.checkBody('name','name field is required').notEmpty();


  //Check Errors
  var errors=req.validationErrors();
  if(errors){
    res.render('addcategory',{
      "errors":errors
    });
  } else {
    var categories= db.get('categories');
    categories.insert({
      "name":name
  },function(err,category){
      if(err){
        res.send(err)
      } else {
        req.flash('succes','Category Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});
module.exports = router;
