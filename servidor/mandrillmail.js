let mandrill=require("mandrill-api/mandrill"),
config=require("./config"),
mandrill_client=new mandrill.Mandrill(config.mandrillKey);

function contactEmail(to,globalMergeVars,mergeVars,language,callback){
	console.log(arguments);
	let subject="Mensaje recibido";
	if(language==="es"){
		subject="Mensaje recibido";
	}else if(language==="en"){
		subject="Message received";
	}else{
		language="es";
	}
	let message={
		"subject":subject,
		"from_email":"info@cleverleaves.com",
		"from_name":"Info - Clever Leaves",
		"to":to,
		"important":true,
		//"track_opens":true,
		//"track_clicks":true,
		//"inline_css":true,
		//"preserve_recipients":false,
		//"view_content_link":false,
		"merge":true,
		"merge_language":"handlebars",
		"global_merge_vars":globalMergeVars,
		"merge_vars":mergeVars
	};
	mandrill_client.messages.sendTemplate({
		"template_name":language+"ContactEmail",
		"template_content":[],
		//"async":true,
		"message":message
	},function(result){
		console.log("result contactEmail",result);
		callback(null,result);
	},function(error){
		console.log("error contactEmail",error);
		callback(error,null);
	});
}

exports.contactEmail=contactEmail;