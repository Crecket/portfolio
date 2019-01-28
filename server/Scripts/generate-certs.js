const fs = require("fs");
const selfsigned = require("selfsigned");

const attrs = [{ name: "commonName", value: "portfolio.local.test" }];
const pems = selfsigned.generate(attrs, {
    keySize: 2048,
    days: 365,
    algorithm: "sha256"
});

fs.writeFileSync(__dirname + "/../../temp/certificate.key", pems.private);
fs.writeFileSync(__dirname + "/../../temp/certificate.pem", pems.cert);
fs.writeFileSync(__dirname + "/../../temp/publickey.pem", pems.public);
