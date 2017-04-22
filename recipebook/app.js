var express=require("express"),
    path=require("path"),
    bodyParser=require("body-parser"),
    cons=require('consolidate'),
    dust=require('dustjs-helpers'),
    pg=require('pg'),
    app=express();
//DB Connect String
var connect="postgres://eduonix:123456@localhost/recipebookdb";

//Assign Dust Engine To .dust files
app.engine('dust',cons.dust);

//Set Default Ext .dust
app.set('view engine','dust');
app.set('views',__dirname+'/views');

//Set public Folder
app.use(express.static(path.join(__dirname,'public')));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Server
app.listen(3000,function(){
  console.log('Server running at 3000...');
});

app.get('/',function(req,res){
  pg.connect(connect,function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query('SELECT * FROM recipes',function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      res.render('index',{recipes:result.rows});
      done(err);
    });
  });
});

app.post('/add',function(req,res){
  pg.connect(connect,function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("INSERT INTO recipes(name,ingredients,directions) Values($1,$2,$3)",
      [req.body.name,req.body.ingredients,req.body.directions]);
      done();
      res.redirect('/');
  });
});

app.delete('/delete/:id',function(req,res){
  pg.connect(connect,function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("DELETE FROM recipes where id=$1",
      [req.params.id]);
      done();
      res.send(200);
  });
});

app.post('/edit',function(req,res){
  pg.connect(connect,function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4",
      [req.body.name,req.body.ingredients,req.body.directions,req.body.id]);
      res.redirect('/');
  });
});
