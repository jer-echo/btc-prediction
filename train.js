const brain = require('brain.js');
const data = require('./close.json');    
const fs = require("fs");

const net = new brain.recurrent.LSTMTimeStep();

net.train([data],{
    "iterations": 1,
    "errorThresh": 0.1,
    "log": true,
    "logPeriod": 1,
    "learningRate": 0.3,
    "momentum": 0.1,
    "callbackPeriod": 1,
    "timeout": null
});

const netState = net.toJSON();
fs.writeFileSync("net.json",  JSON.stringify(netState), "utf-8");