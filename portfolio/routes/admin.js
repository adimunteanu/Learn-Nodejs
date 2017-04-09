var express=require('express');
var router=express.Router();
var multer=require('multer');
var upload=multer({dest: './public/images/portfolio'});
var mysql=require('mysql');

var connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'qwertyabc',
  database:'portfolio'
});

connection.connect();

router.get('/',function(req,res,next){
  res.render('admin/index');
});

router.get('/add',function(req,res,next){
  res.render('admin/add');
});

router.post('/add',upload.single('projectimage'),function(req,res,next){
  var title=req.body.title;
  var description=req.body.description;
  var service=req.body.service;
  var url=req.body.url;
  var client=req.body.client;
  var projectdate=req.body.projectdate;

  if(req.file){
    var projectImageName=req.file.filename;
  } else {
    var projectImageName='noimage.jpg';
  }

  req.checkBody('title','Title field is required').notEmpty();
  req.checkBody('service','Service field is required').notEmpty();
  var errors=req.validationErrors();

  if(errors){
    res.render('admin/add',{
      errors:errors,
      title:title,
      description:description,
      service:service,
      client:client,
      url:url
    });
  } else {
    var project={
      title:title,
      description:description,
      service:service,
      client:client,
      date:projectdate,
      url:url,
      image:projectImageName
    };
  };
  var query=connection.query('INSERT INTO projects SET ?',project,function(err,result){
    console.log('Error: '+err);
    console.log('Result: '+result);
  });

  req.flash('succes',"Project added");
  res.redirect('/admin');
});
module.exports=router;
