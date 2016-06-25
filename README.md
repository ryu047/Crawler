# Crawler
Search anything on Web.

Crawler is simple NodeJS based web crawler that crawls a website within seconds.

**Quick start**

1. Clone the repo and `cd path_to_directory`
2. `npm install`.
3. `npm start search_term`.

**Configuration Options**

To configure Crawler, edit the following options in the 'Options' object in 'main.js' file. 

1. address: This is the website to be crawled. http://quora.com is passed by default. It can be any known address.
2. term: This is passed through command line only while starting Crawler.( `npm start search_term`)
3. maxPages: This is the maximum number of pages of the website that will be crawled. 50 is set by default.
4. maxConcurrency: This is maximum number of requests can be sent at any given time. 5 is set by default.

**Ouput**

1. All the links where search_term is found are compiled in a HTML file at the end of the crawling.
2. Console outputs links as they are crawled.
