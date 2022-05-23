document.addEventListener('DOMContentLoaded', init)

async function getRawData(){
    return await (await fetch('close.json')).json()
}

async function init(){
    const net = new brain.recurrent.LSTMTimeStep();
    const raw = await getRawData();
    net.train([raw])
    console.log(raw.splice(0,5))
    console.log(net.run(raw.splice(0,4)))
}