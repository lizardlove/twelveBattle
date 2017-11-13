/*
* @Author: 10261
* @Date:   2017-07-05 10:38:24
* @Last Modified by:   10261
* @Last Modified time: 2017-08-04 17:38:49
*/

'use strict';
var express = require("express");
var bodyParser = require('body-parser');
var http = require("http");
var fs = require("fs");

var app = express();

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/map", function (req, res) {
	console.log(req.body);
	var order = req.body.order;
	var file;
	if (order == 1) {
		file = "./map/map.json";
	} else if (order == 2) {
		file = "./map/last.json";
	}
	var result = JSON.parse(fs.readFileSync(file));
	console.log(result);
	res.end(JSON.stringify(result));
});

http.createServer(app).listen(9999);
console.log("run in 9999");