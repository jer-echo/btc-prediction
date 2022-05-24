document.addEventListener('DOMContentLoaded', init)

class Cases {
    last = null
    cases = {
        // case # : [less, more, message]
        1: [0, -.50, "greater than -.50% but less than 0%"],
        2: [-.50, -1, "greater than -1% but less than -.50%"],
        3: [-1, -2, "greater than - 2 % but less than -1%"],
        4: [-2, null, "less than - 2%"],
        5: [.50, 0, "less than .50 but more than 0%"],
        6: [1, .50, "less than 1 % but more than .50%"],
        7: [2, 1, "less than 2 % but more than 1%"],
        8: [null, 2, "more than 2%"]
    }

    result = {
        // case #: counter
    }

    add(close){
        if(this.last == null) {
            this.last = close
            return;
        }
        const p = ((close-this.last)/this.last) * 100;
        this.last = close
        // console.log(p)
        for(var x in this.cases) {
            const c = this.cases[x];
            if(c[0] !== null && c[1] !== null) {
                if(p < c[0] && p > c[1]) {
                    this.result[x] = (this.result[x] || 0) + 1
                }
            } else if (c[0] === null) {
                if(p > c[1]) {
                    this.result[x] = (this.result[x] || 0) + 1
                }
            } else if (c[1] === null) {
                if(p < c[0]) {
                    this.result[x] = (this.result[x] || 0) + 1
                }
            }
        }
        // console.log(this.result)
    }

    map(cb){
        if(typeof cb == 'function') {
            for(var x in this.cases) {
                const caseNumber = x
                const value = this.result[x] || 0
                const message = this.cases[x][2]
                cb(caseNumber, value, message)
            }
        }
    }
}

function chucks(arr, chuckSize,iterate = null) {
    const n = [];
    for (let i = 0; i < arr.length; i += chuckSize) {
        const chunk = arr.slice(i, i + chuckSize);
        n.push(chunk);
    }
    if (typeof iterate != 'function') return n
    for (let i = 0; i < n.length; i++) {
        iterate(n[i],i,n.length)
    }
}

function ave (arr, chuckSize = null) {
    if(chuckSize !== null) {
        const pc = chucks(arr, chuckSize)
        const n = []
        for(var i = 0; i < pc?.length; i++) {
            n.push(ave(pc[i]))
        }
        return n
    }
    return arr.reduce( ( p, c ) => p + c, 0 ) / arr.length
}

function range(x) {
    const r = []
    for(var i = 0; i<x;i++) r.push(i)
    return r
}

async function getJson(path){
    return await (await fetch(path)).json()
}

async function init(){

    // compress data
    const COMPRESS = 60

    // chart X axis/label 
    const CHARTLEN = 100

    var data = ave((await getJson('close.json')), COMPRESS)

    const total_cases = new Cases()
    chucks(data, 1, function(chuck,i,t) {
        // console.log(`${i} of ${t}`)
        total_cases.add(ave(chuck))
    })
    total_cases.map((x,y,c) => document.querySelector(`#total-${x}`).innerText = `${y} instances of ${c}`)

    const myChart = new Chart('chart', {
        type: 'line',
        data: {
            labels: range(CHARTLEN),
            datasets: [{
                label: 'Close value',
                backgroundColor: 'orange',
                borderColor: 'orange',
                data: [],
                tension: 0
            },
            {
                label: 'Prediction',
                backgroundColor: 'lightgray',
                borderColor: 'lightgray',
                data: [],
                tension: 0
            }]
        },
        options: {
            elements: {
                point:{
                    radius: 0
                }
            },
            animation: {
                duration: 0
            }
        }
    });

    const live_cases = new Cases()

    setInterval(() => {
        if(data.length > 0 && data[0]) {
            var actualDataset = myChart.data.datasets[0].data
            var predictionDataset = myChart.data.datasets[1].data

            if(actualDataset.length >= myChart.data.labels.length) {
                myChart.data.datasets[0].data = actualDataset.splice(1)
            }

            if(predictionDataset.length >= myChart.data.labels.length) {
                myChart.data.datasets[1].data = predictionDataset.splice(1)
            }
            
            const a_ave = data.splice(0, 1)[0]
            const p_ave = data.splice(0, 1)[0] - 200
            live_cases.add(a_ave)
            actualDataset.push(a_ave)
            predictionDataset.push(p_ave)
            myChart.update()
            live_cases.map((x,y,c) => document.querySelector(`#live-${x}`).innerText = `${y} instances of ${c}`)
        }
    }, 0)
}