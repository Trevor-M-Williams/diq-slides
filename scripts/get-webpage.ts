import fs from 'fs';

const url = 'https://www.cybertekiq.com/director-iq';

const response = await fetch(url);
let html = await response.text();

const scriptRegex = /<script src="https:\/\/main--da-slides\.netlify\.app\/index\.js"><\/script>/;
html = html.replace(scriptRegex, '');
html = html.replace('</body>', '<script src="http://localhost:3000/index.js"></script></body>');

fs.writeFileSync('index.html', html);
