let express = require('express'),
    net = require('net'),
    app = express(),
    port = process.env.PORT || 5000,
    bodyParser = require('body-parser'),
    route = require('./routes'),
    cors = require('cors'),
    { rs_port, rs_adress }  = require('./config'),
    { translateKukaData, sendExtendedData, prepareStackerData } = require('./iotAgent'),
    ModbusRTU = require('modbus-serial'),
    stackerClient = new ModbusRTU()

app.use(cors())
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  })
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
app.use('/api', route.router)


app.listen(port);

console.log('RESTful API server started on: ' + port);

// connect with RS232

let info = {
  numberOfFinishingLayers: 0,
  layersTimes: [],
  waitingData: '',
  waitingExtendedData: '',
  isDuringKUKA: false,
  isDuringExtended: false,
  stackerLayerStatus: null,
  stackerBoardCount: null,
  isStackerRunning: null
  //waitingForExtended: false
}

clientRs232 = new net.Socket();

startConnect = () => {
  clientRs232.connect(rs_port, rs_adress)
}

clientRs232
    .setTimeout(60000)
    .on('connect', () => {
      console.log('Connected', new Date())
    })
    .on('timeout', () => {
      console.log('socket timeout', new Date())
      startConnect()
    })
    .on('error', () => {
      console.log('error', new Date())
      clientRs232.setTimeout(60000)
    })
    .on('close', () => {
      console.log('close', new Date())
    })
    .on('end', () => {
      console.log('end', new Date())
    })

startStackerConnect = () => {
  console.log('stacker connect begin')
  stackerClient.connectTCP('192.168.1.215', { port: 502 })
    .then(prepareStacker)
    .then(function() {
      console.log('Stacker connected')
    })
    .catch(async function(e) {
      await console.log('begin stacker error', e.message)
      await closeStacker()
    })
}

prepareStacker = () => {
  console.log('Stacker prepared')
  stackerClient.setID(1)
  stackerClient.setTimeout(1000)

  runStacker()
}

let stackerIntervalFunction

function runStacker() {
  console.log('stacker is running')
  stackerIntervalFunction = setInterval(() => {
    stackerClient.readInputRegisters(0, 30)
      .then(function(d) {
        console.log('d.data', d.data)
        console.log('Rozpoczecie/zakonczenie: ', d.data[20].toString(16))
        console.log('Ilosc desek: ', d.data[22].toString(16))
        console.log('Wlaczone wylaczone: ', d.data[24].toString(16))
        console.log(' 19: ', d.data[19].toString(16), ' 20: ', d.data[20].toString(16), ' 21: ', d.data[21].toString(16), ' 22: ', d.data[22].toString(16), ' 23: ', d.data[23].toString(16), ' 24: ', d.data[24].toString(16), ' 25: ', d.data[25].toString(16))
        prepareStackerData(d, info)
      })
      .catch(async function(e) {
        await console.log('run stacker error', e.message)
        await closeStacker()
      })
  }, 5000)
}

function closeStacker() {
  console.log('close stacker')
  clearInterval(stackerIntervalFunction)
  stackerClient.close()
  setTimeout(() => {
    startStackerConnect()
  }, 10000)
}

startConnect()
startStackerConnect()

clientRs232.on('data', (data) => {
  if(info.isDuringKUKA) {
    console.log('during KUKA')
    translateKukaData(data, info)
  } else if(info.isDuringExtended /*&& !info.waitingForExtended*/) {
    console.log('during extended KUKA')
    sendExtendedData(data, info)
  } else if(data.includes('WRST')){
    console.log('wrst')
    translateKukaData(data, info)
  } else /*if(!info.waitingForExtended)*/{
    console.log('begin extended')
    sendExtendedData(data, info)
  } /*else {
    console.log('extended is in progress!')
  }*/
})

module.exports = { clientRs232 }