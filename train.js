const brain = require('brain.js');
const data = require('./close.json');    
const fs = require("fs");

const NET_FILE = 'net.json'
const PAGE_FILE = 'page.json'

function write(f, obj) {
    return fs.writeFileSync(f, JSON.stringify(obj), "utf-8")
}
    
function exists(f) {
    return fs.existsSync(f) 
}

function read(f, d) {
    try {
        return exists(f) ? fs.readFileSync(f, {encoding:'utf8', flag:'r'}) || d : d
    } catch (e ){
        return d
    }
}

function chucks(data, chuckSize, startPage,iterate = null) {
    const total_index = data.length;
    const total_pages = Math.ceil(total_index/chuckSize)
    const res = []
    for (let i = startPage; i <= total_pages; i++) {
        const start_i = (i * chuckSize) - chuckSize
        const end_i = (i * chuckSize) > total_index ? total_index : (i * chuckSize)
        const chuck = Array.from(data).slice(start_i, end_i)
        res.push(chuck)
        if(typeof iterate === 'function') iterate(chuck,i,total_pages)
    }
    return res
}
const start_page = JSON.parse(read(PAGE_FILE, '{"page":1}')).page

chucks(data, 60, start_page, function(chuck,page,total){
    console.log(`status: ${page} of ${total}`)
    const net = new brain.recurrent.LSTMTimeStep();
    const json = JSON.parse(read(NET_FILE, null))
    if(json) net.fromJSON(json);
    net.train([chuck]);
    const netState = net.toJSON();
    write(NET_FILE, netState)
    write(PAGE_FILE, {page})
})