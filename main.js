document.addEventListener('DOMContentLoaded', init)

async function getJson(path){
    return await (await fetch(path)).json()
}

async function getTrainedModel(){
    return await (await fetch('close.json')).json()
} 

async function init(){
    const net = new brain.recurrent.LSTMTimeStep();
    const data = await getJson('close.json')
    const model = await getJson('net.json')
    net.fromJSON(model)
    const r = net.run(data.splice(0,5))
    console.log(r)
}