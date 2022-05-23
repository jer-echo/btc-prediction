const brain = require('brain.js');
const data = require('./close.json');    
const fs = require("fs");

const net = new brain.recurrent.LSTMTimeStep();
net.train([data]);
const netState = net.toJSON();
fs.writeFileSync("net.json",  JSON.stringify(netState), "utf-8");