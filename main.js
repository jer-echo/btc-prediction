document.addEventListener('DOMContentLoaded', init)

async function getRawData(){
    return await (await fetch('close.json')).json()
}

async function init(){
    ;
}