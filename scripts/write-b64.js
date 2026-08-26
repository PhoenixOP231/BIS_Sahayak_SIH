const fs = require('fs');
args = process.argv.slice(2);
fs.writeFileSync(args[0], Buffer.from(args[1], 'base64').toString('utf8'));