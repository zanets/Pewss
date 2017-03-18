const fs = require('fs');
const SSLDirBase = `${__dirname}/SSL`;

module.exports = {
	key: fs.readFileSync(`${SSLDirBase}/privatekey.pem`),
    cert: fs.readFileSync(`${SSLDirBase}/certificate.pem`)
};
