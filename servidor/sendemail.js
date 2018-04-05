let nodemailer=require("nodemailer"),
EmailTemplate=require('email-templates').EmailTemplate;

let smtpTransport=nodemailer.createTransport({
	service:"Gmail",
	auth:{user:"info@cleverleaves.com",pass:"Info16150"}
});

function send(options,body,callback){
	console.log("arguments",arguments);
	let contact=new EmailTemplate(options.html);
	contact.render(body,function(err,results){
		if(err) return callback(err,results);
		options.html=results.html;
		options.text=results.text;
		//console.log(results);
		smtpTransport.sendMail(options,function(err,respuesta){
			if(err){
				console.log("error sendmail:",err);
			}
			else console.log("Message sent:"+JSON.stringify(respuesta));
			callback(err,respuesta);
		});
	});
}

exports.send=send;