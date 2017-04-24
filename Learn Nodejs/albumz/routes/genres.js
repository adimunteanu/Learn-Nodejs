var express=require('express');
var router=express.Router();


router.get('/',function(req,res,next){
  res.render('genres/index');
});

router.get('/add',function(req,res,next){
  res.render('genres/add');
});

router.post('/add',function(req,res,next){
  var genre={
    name:req.body.name
  };
  var genreRef=fbRef.child('genres')
});
module.exports=router;
