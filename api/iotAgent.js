let express = require('express'),
    http = require('http')
    iotAgentLib = require('iotagent-node-lib'),
    axios = require('axios'),
    { config, modbus_adress, modbus_port }  = require('./config'),

exports.initSouthbound = (callback) => {
  southboundServer = {
      server: null,
      app: express(),
      router: express.Router()
  };

  southboundServer.app.set('port', 8080);
  southboundServer.app.set('host', '0.0.0.0');

  southboundServer.router.post('/iot/d', manageULRequest);
  southboundServer.server = http.createServer(southboundServer.app);
  southboundServer.app.use('/', southboundServer.router);
  southboundServer.server.listen(southboundServer.app.get('port'), southboundServer.app.get('host'), callback);
}

const manageULRequest = (req, res, next) => {
  var values;

  iotAgentLib.retrieveDevice(req.query.i, req.query.k, function(error, device) {
      if (error) {
          res.status(404).send({
              message: "Couldn't find the device: " + JSON.stringify(error)
          });
      } else {
          values = parseUl(req.query.d, device);
          iotAgentLib.update(device.name, device.type, '', values, device, function(error) {
              if (error) {
                  res.status(500).send({
                      message: 'Error updating the device'
                  });
              } else {
                  res.status(200).send({
                      message: 'Device successfully updated'
                  });
              }
          });
      }
  });
}

function parseUl(data, device) {
    function findType(name) {
        for (var i = 0; i < device.active.length; i++) {
            if (device.active[i].name === name) {
                return device.active[i].type;
            }
        }

        return null;
    }

    function createAttribute(element) {
        var pair = element.split('|'),
            attribute = {
                name: pair[0],
                value: pair[1],
                type: findType(pair[0])
            };

        return attribute;
    }

    return data.split(',').map(createAttribute);
}

let updateAtrribute = (data) => {
  console.log('dataUpdate:', data)
	axios.patch(`http://${config.contextBrokerAcord.host}:${config.contextBrokerAcord.port}/v2/entities/KUKA/attrs`,
    data,
		{ headers: {
			'Content-Type': 'application/json'
		}})
		.then(res => {
			console.log('Accord Broker update is done', new Date())
		})
		.catch(err => {
			console.log('err', err)
    })
  axios.patch(`http://${config.contextBrokerVirtual.host}:${config.contextBrokerVirtual.port}/v2/entities/KUKA:KUKA1/attrs`,
    data,
		{ headers: {
      'Content-Type': 'application/json'
		}})
		.then(res => {
			console.log('Virtual Broker update is done', new Date())
		})
		.catch(err => {
			console.log('err', err)
		})
}

let updateStackerData = (data) => {
  console.log('dataUpdate:', data)
	axios.patch(`http://${config.contextBrokerAcord.host}:${config.contextBrokerAcord.port}/v2/entities/Stacker:Stacker1/attrs`,
    data,
		{ headers: {
			'Content-Type': 'application/json'
		}})
		.then(res => {
			console.log('Accord Broker update is done (Stacker)', new Date())
		})
		.catch(err => {
			console.log('err', err)
    })
  axios.patch(`http://${config.contextBrokerVirtual.host}:${config.contextBrokerVirtual.port}/v2/entities/Stacker:Stacker1/attrs`,
    data,
		{ headers: {
      'Content-Type': 'application/json'
		}})
		.then(res => {
			console.log('Virtual Broker update is done (Stacker)', new Date())
		})
		.catch(err => {
			console.log('err', err)
		})
}

exports.prepareStackerData = (d, info) => {
        let stackerObject = {}
        // START TIME / END TIME
        if (info.stackerLayerStatus !== null) {
          if (info.stackerLayerStatus === '0' && d.data[20].toString(16) === '1') {
            stackerObject['startTime'] = { 'value': new Date().toISOString(), 'type': 'DateTime' }
            info.stackerLayerStatus = '1'
          } else if (info.stackerLayerStatus === '1' && d.data[20].toString(16) === '0') {
            stackerObject['endTime'] = { 'value': new Date().toISOString(), 'type': 'DateTime' }
            info.stackerLayerStatus = '0'
          }
        } else {
          if(d.data[20].toString(16) === '0') {
            stackerObject['endTime'] = { 'value': new Date().toISOString(), 'type': 'DateTime' }
            info.stackerLayerStatus = '0'
          } else {
            stackerObject['startTime'] = { 'value': new Date().toISOString(), 'type': 'DateTime' }
            info.stackerLayerStatus = '1'
          }
        }
        // BOARD COUNT
        if(info.stackerBoardCount !== null) {
          if(info.stackerBoardCount !== d.data[22].toString(16)) {
            stackerObject['boardCount'] = { 'value': parseInt(d.data[22].toString(16)), 'type': 'Number' }
            info.stackerBoardCount = d.data[22].toString(16)
          }
        } else {
          stackerObject['boardCount'] = { 'value': parseInt(d.data[22].toString(16)), 'type': 'Number' }
          info.stackerBoardCount = d.data[22].toString(16)
        }
        //RUNNING
        if(info.isStackerRunning !== null) {
          if(info.isStackerRunning !== d.data[24].toString(16)) {
            parseInt(d.data[24].toString(16)) === 1
              ? stackerObject['isRunning'] = { 'value': true, 'type': 'Boolean' }
              : stackerObject['isRunning'] = { 'value': false, 'type': 'Boolean' }
            info.isStackerRunning = d.data[24].toString(16)
          }
        } else {
          parseInt(d.data[24].toString(16)) === 1
              ? stackerObject['isRunning'] = { 'value': true, 'type': 'Boolean' }
              : stackerObject['isRunning'] = { 'value': false, 'type': 'Boolean' }
          info.isStackerRunning = d.data[24].toString(16)
        }
        console.log('info after stacker', info)
        console.log('stackerObject', stackerObject)
        if(Object.keys(stackerObject).length !== 0) {
          updateStackerData(stackerObject)
        }
}

let average = (array) => array.reduce((a, b) => a + b) / array.length

exports.translateKukaData = (messData, info) => {
  let dataForUpdate = {}
  let dataObject = {}
  let dataList
  // CONVERT DATA TO STRING AND REMOVE TRASH CHARS
  let data = messData.toString()
  console.log('data', data)
  // CHECK DATA IS FULL
  if(data.charAt(data.length - 2) !== '.') {
    info.isDuringKUKA = true
    return info.waitingData = data
  }
  info.isDuringKUKA = false
  console.log('data', info.waitingData + data, new Date())
  dataList = (info.waitingData + data).split('.')
  info.waitingData = ''
	dataList.map(item => {
    let newItem = item.split('=')
    if(newItem[0] && newItem[1]) {
      dataObject[newItem[0].replace('\u0011', '').replace('\u0013', '')] = newItem[1].replace('\u0011', '').replace('\u0013', '')
    }
  })

  console.log('dataObject', dataObject)
  if(dataObject['ID PACK'] && parseInt(dataObject['ID PACK']) !== info.carrierId) {
    info.heights = []
    info.layersTimes = []
    // NEW PACK
    if(dataObject['HEIGHT PACK']) {
      info.mainHeight = Math.floor(parseInt(dataObject['HEIGHT PACK']))
      info.height = Math.floor(parseInt(dataObject['HEIGHT PACK']))
      // ADD HEIGHT TO LIST
      if(dataObject['THICK TIM']) {
        info.numberOfLayers = Math.floor(info.mainHeight / dataObject['THICK TIM'])
      }
      dataForUpdate['totalCarrierLayers'] = { 'value': info.numberOfLayers, 'type': 'Number' }
      info.startLayerDate = (+ new Date())
    }
    info.numberOfFinishingLayers = 0
    dataForUpdate['carrierId'] = { 'value': parseInt(dataObject['ID PACK']), 'type': 'Number' }
    dataForUpdate['totalCarrierLayersCompleted'] = { 'value': 0, 'type': 'Number' }
    dataForUpdate['startPaletteProcessingTime'] = { 'value': + new Date(), 'type': 'Number' }
    info.carrierId = parseInt(dataObject['ID PACK'])
  } else {
    // NEW LAYER
    if(dataObject['HEIGHT PACK']) {
      // FINISH LAYER
      info.numberOfFinishingLayers += 1
      info.heights.push(info.height - parseInt(dataObject['HEIGHT PACK']))
      info.height = parseInt(dataObject['HEIGHT PACK'])
      info.numberOfLayers = Math.floor(info.mainHeight / info.heights.length ? Math.floor(average(info.heights)) : 1)
      dataForUpdate['totalCarrierLayers'] = { 'value': info.numberOfLayers, 'type': 'Number' }
      // END LAYER DATE
      info.endLayerDate = (+ new Date())
      // UPDATE NUMBER OF FINISHED LAYERS AND % NUMBER
      dataForUpdate['totalCarrierLayersCompleted'] = { 'value': info.numberOfFinishingLayers, 'type': 'Number' }
      dataForUpdate['carrierLayersProgress'] = { 'value': Math.floor(info.numberOfFinishingLayers * 100 / info.numberOfLayers), 'type': 'Number' }
      // UPDATE REMAINING TIME
      info.endLayerDate - info.startLayerDate < 100000 && info.layersTimes.push(info.endLayerDate - info.startLayerDate)
      let averageTime = info.layersTimes.length ? Math.floor(average(info.layersTimes) / 1000) : 0
      console.log('info.layersTimes', info.layersTimes, info.endLayerDate - info.startLayerDate)
      console.log('info.heights', info.heights, new Date())
      console.log('averageTime', averageTime, new Date())
      console.log('carrierTimeRemaining', Math.floor(averageTime * (info.numberOfLayers - info.numberOfFinishingLayers)))
      if(info.numberOfFinishingLayers === info.numberOfLayers) {
        info.layersTimes = []
        dataForUpdate['startPaletteProcessingTime'] = { 'value': 0, 'type': 'Number' }
      } else {
        let newTime = Math.floor(averageTime * (info.numberOfLayers - info.numberOfFinishingLayers) / 60)
        newTime < 0 && (newTime = 0)
        dataForUpdate['carrierTimeRemaining'] = { 'value': newTime, 'type': 'Number' }
      }
      info.startLayerDate = (+ new Date())
    }
  }
  if(dataObject['ROBOT ON']) {
    dataObject['ROBOT ON'] = !!+dataObject['ROBOT ON']
    dataForUpdate['active'] = { 'value': dataObject['ROBOT ON'], 'type': 'Boolean' }
    dataForUpdate['lastStateChange'] = { 'value': + new Date(), 'type': 'Number' }
  }
  if(Object.keys(dataForUpdate).length !== 0) {
    updateAtrribute(dataForUpdate)
  }
}

exports.sendExtendedData = (data, info) => {
  data = data.toString()
  if(!data.includes('.')) {
      info.waitingExtendedData = data
      info.isDuringExtended = true
      console.log('niepelne', info.waitingExtendedData)
      return 0
  } else {
      let newData = info.waitingExtendedData + data
      console.log('newData', newData)
      info.waitingExtendedData = ''
      info.isDuringExtended = false
      if(newData.includes('512') || newData.includes('612')) {
          /*if (newData.includes('512')) {
            info.waitingForExtended = true
          }*/
          sendExtendedDataToKuka(info)
      } else {
          console.log('err')
      }
  }
}

let getDataFromBroker = async () => {
  await console.log('get')
  let data = await axios.get(`http://${config.contextBrokerAcord.host}:${config.contextBrokerAcord.port}/v2/entities`)
    .then(res => {
      return {
        'carrierId': res.data[1].carrierId.value,
        'depth': res.data[1].depth.value
      }
    })
    .catch(err => {
			console.log('err', err)
      return 0
		})
    await console.log('data', data)
    return await data
}

let updateExtended = (data) => {
  axios.patch(`http://${config.contextBrokerAcord.host}:${config.contextBrokerAcord.port}/v2/entities/KUKA_SCANER_DATA/attrs`,
    data,
		{ headers: {
			'Content-Type': 'application/json'
		}})
		.then(res => {
			console.log('Accord Broker update is done', new Date())
		})
		.catch(err => {
			console.log('err', err)
    })
  axios.patch(`http://${config.contextBrokerVirtual.host}:${config.contextBrokerVirtual.port}/v2/entities/KUKA_SCANER_DATA/attrs`,
    data,
		{ headers: {
      'Content-Type': 'application/json'
		}})
		.then(res => {
			console.log('Virtual Broker update is done', new Date())
		})
		.catch(err => {
			console.log('err', err)
		})
}

let sendExtendedDataToKuka = async (info) => {
  await console.log('akuku')
  let i = await 0
  let isData = await false
  let brokerData = await null
  let getDataInterval = setInterval(async () => {
    brokerData = await getDataFromBroker()
    if(brokerData && brokerData.carrierId && brokerData.depth && brokerData.carrierId !== '0' && brokerData.depth !== '0') {
      isData = await true
    } else {
      i += await 1
      await console.log('i', i)
    }
    if(isData || i > 20) {
      //info.waitingForExtended = await false
      await console.log('brokerData', brokerData)
      await console.log('its time to stop')
      await clientRs232.write((brokerData.depth).toString())
          await console.log('send depth ', brokerData.depth)
          await setTimeout(() => {
            clientRs232.write((parseInt(brokerData.depth) + 1).toString())
            console.log('send depth + 1: ', brokerData.depth +1)
          }, 1000)

          await setTimeout(() => {
              clientRs232.write((brokerData.carrierId).toString())
              console.log('send id: ', brokerData.carrierId)
          }, 2000)
      await console.log('quit')
      await clearInterval(getDataInterval)
    }
  }, 6000)
}