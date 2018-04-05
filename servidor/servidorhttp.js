let express=require('express'),
database=require("./database.js"),
bodyParser=require('body-parser'),
crypto=require("crypto"),
path=require("path"),
mime=require("mime"),
compression=require("compression"),
url=require("url"),
https=require("https"),
req=require("request"),
//sendEmail=require("./sendemail.js"),
mandrillmail=require("./mandrillmail.js"),
config=require("./config"),
os=require("os");

let cachedImages={};

let date=new Date();//new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),new Date().getHours()-5,0,0,0
console.log("currentDate",date.toString(),"currentDateUTC",date.toUTCString());
console.log("crypto.getHashes",JSON.stringify(crypto.getHashes()),"\ncrypto.getCiphers",JSON.stringify(crypto.getCiphers()),"\ncrypto.DEFAULT_ENCODING",crypto.DEFAULT_ENCODING);
process.title="cleverleaves";
console.log("networkInterfaces",os.networkInterfaces(),
"\nenv",process.env,
"\nconfig",process.config,
"\nrelease",process.release,
"\nversions",process.versions,
"\nmemoryUsage",process.memoryUsage(),
"\nserverconfig",config,
"\n__dirname",__dirname,
"\ncpus",os.cpus().length,os.cpus().map(function(element,index,array){return element.model}),
"\ntotalmem",os.totalmem(),
"\nfreemem",os.freemem(),
"\ntype",os.type(),
"\narchitecture",process.arch,
"\nplatform",process.platform,
"\nprocess pid",process.pid,
"\nprocess.env.WEB_CONCURRENCY",process.env.WEB_CONCURRENCY,
"\nprocess.env.WEB_MEMORY",process.env.WEB_MEMORY);

let sendError=function(error,request,response){
	console.log("sendError",JSON.stringify(error,null,2));
	let message;
	if(typeof error==="string") message=error;
	else message=JSON.stringify(error);
	response.status(500);
	response.end("500 Internal Server Error: "+message);
};

let compressFilter=function(request,response){
	if(!!request.query.download) return false;
	return true;
};

let app=express();
app.use(require("prerender-node").set("prerenderServiceUrl",config.prerenderURL));
let port=process.env.PORT || config.webServerEndPointPort;
let httpServer=require("http").createServer(app);

httpServer.listen(port,function(){
	console.log("cleverleaves server listening on port "+port);
});

let router=express.Router();

app.disable("x-powered-by");
app.use(bodyParser.urlencoded({extended:true}));//true qs or false querystring library
app.use(bodyParser.json({strict:false}));

app.use("/api",database.api);

app.use(function(request,response,next){
	
	response.on("error",function(){console.log("response.onerror",err,response.socket.remoteAddress);});
	
	if(/get/i.test(request.method)){
		if(request._parsedUrl.pathname==="/index" || request._parsedUrl.pathname==="/index/") request.url="/main.html";
		else if(request._parsedUrl.pathname==="/error" || request._parsedUrl.pathname==="/error/") request.url="/main.html";
		else if(request._parsedUrl.pathname==="/about" || request._parsedUrl.pathname==="/about/") request.url="/main.html";
		else if(request._parsedUrl.pathname==="/portfolio" || request._parsedUrl.pathname==="/portfolio/") request.url="/main.html";
		else if(request._parsedUrl.pathname==="/about-canabis" || request._parsedUrl.pathname==="/about-canabis/") request.url="/main.html";
		else if(request._parsedUrl.pathname==="/contact" || request._parsedUrl.pathname==="/contact/") request.url="/main.html";
	}
	
	response.set("Cache-Control","no-cache, must-revalidate");
	response.set("X-Frame-Options","DENY");
	
	console.log(/android\s4/ig.test(request.headers["user-agent"]),request.headers["user-agent"]);
	
	next();
});

app.use("/",router);
app.use(compression({filter:compressFilter,level:9,memLevel:9}));
app.use(express.static(__dirname+"/../public",{"index":"main.html",setHeaders:function(response,path,stat){
	if(path==="/"){
		path="/main.html";
		response.type(mime.lookup(path)+"; charset=utf-8");
	}
}}));

router.param("p1",function(request,response,next,p1){
	//console.log('router.param(p1)'+p1);
	request.p1=p1;
	next();
});

router.param("p2",function(request,response,next,p2){
	//console.log('router.param(p2)'+p2);
	request.p2=p2;
	next();
});

router.route("/getimage")
.get(function(request,response,next){
	console.log("getimage>>>request.query",request.query,"request.body",request.body);
	if(!request.query.url){response.status(405);response.end("error - campos vacios");}
	else{
		let address=url.parse(request.query.url);
		address.path=path.parse(address.path);
		req.get({url:address.href,encoding:"binary"}).on("response",function(res){
			response.type(mime.lookup(address.path.base)+"; charset=utf-8");
		}).on("error",function(error){
			sendError(error,request,response);
		}).pipe(response);
	}
});

router.route("/indexsliderdata")
.get(function(request,response,next){
	console.log("indexsliderdata>>>request.query",request.query,"request.body",request.body);
	let Slide=database.Parse.Object.extend("Slide");
	let queryDb=new database.Parse.Query(Slide);
	queryDb.equalTo("slider","index");
	queryDb.ascending("order");
	queryDb.find({useMasterKey:true})
	.then(function(items){
		response.end(JSON.stringify(items));
	},function(error){sendError(error,request,response)});
});

router.route("/contact")
.post(function(request,response,next){
	console.log("contact>>>request.query",request.query,"request.body",request.body);
	if(!request.body.name || !request.body.email || !request.body.phone || !request.body.company || !request.body.message){response.status(400);response.end("error - campos vacios");}
	else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z\s]{1,100}$/.test(request.body.name)
		|| !/^[a-z0-9._-]{1,50}@[a-z0-9_-]{1,50}\.[a-z.]{2,10}$/.test(request.body.email)
		|| !/^[(0-9+\s())(e?x?t?(\d*))]{7,50}$/.test(request.body.phone)
		|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z\s]{1,100}$/.test(request.body.company)
		|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@#]{1,600}$/.test(request.body.message)){response.status(400);response.end("error - campos erroneos");}
	else{
		request.body.message=request.body.message.replace(/\n/g,"<br />");
		let to=[
			{"email":request.body.email,"name":request.body.name,"type":"to"},
			{"email":"info@cleverleaves.com","name":"info cleverleaves","type":"bcc"}
		];
		let globalMergeVars=[
			{"name":"name","content":request.body.name},
			{"name":"message","content":request.body.message},
			{"name":"email","content":request.body.email},
			{"name":"phone","content":request.body.phone},
			{"name":"company","content":request.body.company}
		];
		let mergeVars=undefined;
		mandrillmail.contactEmail(to,globalMergeVars,mergeVars,request.body.language,function(error,result){
			if(error) sendError(error,request,response);
			else{
				//if(result[0].status=="rejected"){
				//  sendError(result,request,response);
				//}else{
				response.end("mensaje enviado");
				//}
			}
		});
		
		
		/*request.body.message=request.body.message.replace(/\n/g,"<br></br>");
		let mailOptions={
			from:"Info - Clever Leaves <info@cleverleaves.com>",
			subject:"Contacto - respuesta automática",
			to:request.body.name+" - "+request.body.company+" <"+request.body.email+">",cc:"admin <info@cleverleaves.com>",bcc:"admin2 <jhon@moadw.com>",
			//attachments:[{path:"./public/img/logoactuartolima.png", cid:"logo"}],
			text:"",
			html:"./public/templates/secondary/contactemail"
		};
		sendEmail.send(mailOptions,request.body,function(error,response2){//clonar solicitud.body
			if(error) sendError(error,request,response);
			else response.end("mensaje enviado.");
		});*/
	}
});

router.route("/pagedata")
.get(function(request,response,next){
	console.log("pagedata>>>request.query",request.query,"request.body",request.body);
	if(!request.query.page){response.status(400);response.end("error - campos vacios");}
	else{
		let Page=database.Parse.Object.extend("Page");
		let queryDb=new database.Parse.Query(Page);
		queryDb.equalTo("url",request.query.page);
		queryDb.first({useMasterKey:true})
		.then(function(item){
			if(!item){
				response.status(405);response.end("error - pagina no encontrada");
			}else{
				response.end(JSON.stringify(item));
			}
		},function(error){sendError(error,request,response)});
	}
});

router.route("/configdata")
.get(function(request,response){
	console.log("configdata>>>","request.query",request.query,"request.body",request.body);
	let Configuration=database.Parse.Object.extend("Configuration");
	let queryDb=new database.Parse.Query(Configuration);
	queryDb.exists("objectId");
	queryDb.first({useMasterKey:true})
	.then(function(item){
		if(!item){
			response.status(405);response.end("error - item no encontrado");
		}else{
			response.end(JSON.stringify(item));
		}
	},function(error){sendError(error,request,response)});
});

router.route("/teamdata")
.get(function(request,response){
	console.log("teamdata>>>","request.query",request.query,"request.body",request.body);
	let TeamMember=database.Parse.Object.extend("TeamMember");
	let queryDb=new database.Parse.Query(TeamMember);
	queryDb.exists("objectId");
	queryDb.ascending("order");
	queryDb.find({useMasterKey:true})
	.then(function(items){
		let array={};
		array.team=items.filter(function(element,index,array){return element.get("type")==="TEAM"});
		array.advisoryTeam=items.filter(function(element,index,array){return element.get("type")==="MANAGEMENT ADVISORY TEAM"});
		response.end(JSON.stringify(array));
	},function(error){sendError(error,request,response)});
});

router.route("/pagesdata")
.get(function(request,response){
	console.log("teamdata>>>","request.query",request.query,"request.body",request.body);
	let Page=database.Parse.Object.extend("Page");
	let queryDb=new database.Parse.Query(Page);
	queryDb.exists("objectId");
	queryDb.ascending("order");
	queryDb.find({useMasterKey:true})
	.then(function(items){
		response.end(JSON.stringify(items));
	},function(error){sendError(error,request,response)});
});















router.route("*")
.post(function(request,response,next){
	console.log("router.route(*)");
	if(response.statusCode===403){
		response.end("error - 403 Forbidden");
	}else if(response.statusCode===401){
		response.end("error - 401 Unauthorized");
	}else{
		response.status(405);
		response.end("error - 405 Method not allowed");
	}
})
.put(function(request,response,next){
	console.log("router.route(*)");
	if(response.statusCode===403){
		response.end("error - 403 Forbidden");
	}else if(response.statusCode===401){
		response.end("error - 401 Unauthorized");
	}else{
		response.status(405);
		response.end("error - 405 Method not allowed");
	}
})
.delete(function(request,response,next){
	console.log("router.route(*)");
	if(response.statusCode===403){
		response.end("error - 403 Forbidden");
	}else if(response.statusCode===401){
		response.end("error - 401 Unauthorized");
	}else{
		response.status(405);
		response.end("error - 405 Method not allowed");
	}
})
.options(function(request,response,next){
	response.set("Access-Control-Allow-Methods","HEAD,GET,POST,PUT,DELETE,OPTIONS");
	response.set("Allow","HEAD,GET,POST,PUT,DELETE,OPTIONS");
	response.set("Access-Control-Max-Age","1728000");//20dias
	response.status(200);
	response.end();
});

app.get("*",function(request,response){
	//console.log("app.get(404)");
	response.status(404);
	let options={root:"./public/",dotfiles:"deny",headers:{}};
	response.type("text/html; charset=utf-8");
	response.sendFile("main.html",options,function(err){
		if(err) sendError({"error response.sendFile.":err},request,response);
	});
});

