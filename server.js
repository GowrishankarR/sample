var express = require("express");
var http = require('http');
var app = express();
var bodyParser= require('body-parser');
var fs=require('fs');
var inputData,file=[];
var multer=require('multer');
// use the static files for page giving
app.use(express.static(__dirname +"/public")) 
// parse application/json 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// checking the server, get function working or not on loaded of /info loaded
app.get("/info", function(req,res){
	res.send("it's from server dude and ur ip is : "+req.connection.remoteAddress);
	res.end();
});
// get the instant typping value of input from angular and store it in file system
app.post("/textdata", function(req,res)
{
	inputData=req.body.mydata;
	console.log(inputData)
	file=[];
	var dir='./fromnode';
	if(!fs.existsSync(dir))
	{
		fs.mkdirSync(dir);
	}
	fs.writeFile("./fromnode/"+inputData.storename+".json",JSON.stringify(inputData));
	var namer=fs.readdirSync(dir);//read the file in synchronous way
	namer.forEach(function(fl){
		file.push(fl);
	})
	res.send(file);
	res.end();
});
// send the input value back to angular
app.get("/typedval",function(req,res){
	console.log(req,res)
	res.send(inputData.value1);
	res.end();
})
// get the loading file from angular UI
app.post("/fileUpload",function(req,res){
 		upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.send("success");
        });
})
//multers disk storage settings for store uploaded file
 var storage = multer.diskStorage({ 
        destination: function (req, file, cb) {
            cb(null, './fromnode/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
//multer settings for single file or multiple file
    var upload = multer({ 
                    storage: storage
                }).single('file');
// images from disk and send to angular UI
app.get("/getimages",function(req,res){
	file=[];
	var namer=fs.readdirSync("./fromnode");//read the file in synchronous way
	namer.forEach(function(fl){
		file.push(fl);
	});
	file.forEach(function(f1){})
		var myfiles=fs.readFileSync("./fromnode/theo_james_four_insurgent-wide.jpg");
		console.log(myfiles)
		res.writeHead(200, {'Content-Type': 'image/jpg' });
 		 res.end(myfiles, 'binary');
	
});
// create the server for listening request and response sending
app.set('port', 3000);
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port.. . ' + app.get('port'));
});
