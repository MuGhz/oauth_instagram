var express = require('express');
var app = express();
var httpRequest = require('request');
var client_id = 'a71a46474825476ab7b5658d3295fa0b';
var client_secret = '2086e78e343d45bb89d3ee18b9e46d09';
var redirect_uri = 'http://host21014.proxy.infralabs.cs.ui.ac.id/auth';
var oauth_instagram = 'https://api.instagram.com/oauth/authorize/?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=code';
var access_token = '';

app.get('/', function (request, response) {
  response.sendfile('./public/index.html')
});

app.get('/login', function (request, response) {
	response.redirect(oauth_instagram);
});

app.get('/auth', function (request, response) {
	var options = {
		url: 'https://api.instagram.com/oauth/access_token',
		method: 'POST',
		form: {
			client_id: client_id,
			client_secret: client_secret,
			grant_type: 'authorization_code',
			redirect_uri: redirect_uri,
			code: request.query.code
		}
	};
	httpRequest(options, function (error, res, body) {
		if (!error) {
			var user = JSON.parse(body);
			access_token = user.access_token;
			console.log(user);
			console.log(access_token);
			response.redirect('/self');
		} else {
			console.log(error);
		}
	});
});

app.get('/self',function(request, response){
	var options = {
		url: 'https://api.instagram.com/v1/users/self/?access_token=' + access_token,
		method: 'GET'
	};
	httpRequest(options, function (error, res, body) {
		if (!error) {
			console.log(body);
			response.send(JSON.stringify(body));
		}
	}); 
});

app.listen(8080);
console.log('App is runung on port 8080');