const fs = require('fs');
const Base = `${__dirname}/SSL`;

module.exports = {
	key: fs.readFileSync(`${Base}/privatekey.pem`),
    cert: fs.readFileSync(`${Base}/certificate.pem`)
};;