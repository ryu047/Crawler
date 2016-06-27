'use strict';

let Crawler = require('./crawler.js');

/*
Search term is passed as command line argument.
*/

if(process.argv.length <= 2){
	console.log('Usage: npm start <search_term>');
	return;
}

let term = process.argv[2];

/*
Address and Term are mandatory properties to pass in the Crawler.
*/

let options = {
	address: 'http://www.quora.com',
	term: term
};

let crawler = new Crawler(options);

crawler.start();