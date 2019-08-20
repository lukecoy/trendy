import http from 'http';
import url from 'url';
import { Client as Discogs } from 'disconnect';

console.log(`Trendy/${process.env.npm_package_version}`);
console.log(process.env.KEY);
console.log(process.env.SECRET);

const db = new Discogs(`Trendy/${process.env.npm_package_version} +https://github.com/lukecoy/trendy`, {
  consumerKey: process.env.KEY,
  consumerSecret: process.env.SECRET
}).database();

http.createServer(function (request, response) {
  const query = url.parse(request.url, true).query;

  if (!Object.keys(query).length) return response.end();

  db.search(query.q, { title: query.title, artist: query.artist, type: 'master' })
    .then((data) => {
      response.write(JSON.stringify(data));
      response.end();
      console.log(JSON.stringify(query));
    })
    .catch((error) => {
      console.warn('Oops, something went wrong!', error)
    });
}).listen(8080);
