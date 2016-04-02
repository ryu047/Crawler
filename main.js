'use strict';

var fs = require('fs');
var Crawler = require('./crawler.js');

/*
Search term is passed as command line argument.
*/

if(process.argv.length <= 2){
	console.log('Usage: npm start <search_term>');
	return;
}

var term = process.argv[2];

/*
options must have address and term properties. Rest are optional.
*/

var options = {
	address: 'http://www.quora.com',
	term: term,
	maxPages: 100
};

var crawler = new Crawler(options);

crawler.start();

crawler.promise.then((links)=>{
	let text = '';
	links.forEach((link)=>{
		text += '<li><a href=' + link + '>' + link + '</a></li>';
	});
	fs.writeFileSync(term + '.html', text);
	process.exit();
});