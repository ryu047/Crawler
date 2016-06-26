'use strict';

let request = require('request'),
	cheerio = require('cheerio'),
	urlParse = require('url-parse'),
	_ = require('lodash'),
	fs = require('fs');

/*
Function to log messages to console.
*/

let logMessage = message => {
	console.log(message);
};

let printLinks = (links, term) => {
	let text = '';
	links.forEach((link)=>{
		text += '<li><a href=' + link + '>' + link + '</a></li>';
	});
	fs.writeFileSync(term + '.html', text);
	process.exit();
};

/*
Main Crawler Class
*/

class Crawler {
	constructor(options){	//options must not be empty or undefined.
		let that = this,
			url = urlParse(options.address);

		that.START_URL = options.address;
		that.BASE_URL = url.protocol + '//' + url.hostname;
		that.queued = [];
		that.crawled = {};
		that.visited = {};
		that.wordLinks = [];
		that.failedLinks = [];
		that.SEARCH_TERM = options.term;
		that.MAX_CONCURRENCY = options.maxConcurrency || 5;
		that.currentConcurrency = 0;
		that.MAX_PAGES = options.maxPages || 100;
		that.stopped = {status: false};
		Object.observe(that.stopped, (changes)=>{
			logMessage('\nCrawling done!\n');
			logMessage('Word found on following links:\n');
			logMessage(that.wordLinks);
			logMessage('\nCould not crawl following links:\n');
			logMessage(that.failedLinks);
			printLinks(that.wordLinks, that.SEARCH_TERM);
		});
	}

	/*
	Main function to be called to start crawling.
	*/

	start(){
		let that = this;
		that.queued.push(that.START_URL);
		that.crawl();
	}

	/*
	Recursive function that looks for queued items.
	*/

	crawl(){
		let that = this;
		if(that.currentConcurrency <= that.MAX_CONCURRENCY){
			let address = that.queued.shift();
			address && !(address in that.visited) && that.visitPage(address);
			that.currentConcurrency++;
			that.crawl();
		} else {
			setTimeout(that.crawl.bind(that), 100);
		}
	}

	/*
	This function makes network requests. Upon success, searches the given word on the page,
	sets items in queued to be crawled later and puts current page in crawled.  
	*/

	visitPage(address){
		let that = this;
		that.visited[address] = true;
		request(address, (error, response, html)=>{
			if(error){
				that.failedLinks.push(address);
				return;
			}
			let $ = cheerio.load(html);
			that.searchOnPage($) && that.wordLinks.push(address);
			that.setLinks($);
			logMessage(address);
			that.crawled[address] = true;
			if(Object.keys(that.crawled).length > that.MAX_PAGES){
				that.stopped.status = true;
			}
			that.currentConcurrency = 0;
		});
	}

	/*
	Function searches the given word on the page. Returns boolean.
	*/

	searchOnPage($){
		let text = $('html > body').text().toLowerCase();
		return (text.indexOf(this.SEARCH_TERM.toLowerCase()) !== -1);
	}

	/*
	Function sets the items in queued.
	*/

	setLinks($){
		let that = this,
		relativeLinks = $('a[href^="/"]'),
		absoluteLinks = $('a[href^="http"]');

		_.forEach(relativeLinks, (link)=>{
			let properLink = that.BASE_URL + $(link).attr('href');
			that.queued.push(properLink);
		});
		
		_.forEach(absoluteLinks, (link)=>{
			let properLink = $(link).attr('href');
			let url = urlParse(properLink);
			(url.protocol + '//' + url.hostname) === that.BASE_URL && that.queued.push(properLink);
		});
	}
}

module.exports = Crawler;