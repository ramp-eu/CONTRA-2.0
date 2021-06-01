# User & Programmers Manual. 
​
## Prerequisites
In order to use depalletization IoT Agent for RS232 and MODBUS TCP protocol the following elements are required:
​
* machine supporting transparent RS232 communication, providing data in ACSII format. Currently, the agent is configiured to support sustom KUKA KR240 robot ASCII based protocol (see [Data model setup](#Data)) and/or machine supoproting MODBUS TCP protocol connected to the same network as the agent
* hardware IoT gateway converting serial communication to ethernet (e.g. [USR W610](https://www.pusr.com/products/rs232/rs485-to-wifi-converters-usr-w610.html)) to enable IoT capabilities of a machine
* depalletization IoT Agent installed and configured accordingly
* Orion Conext Broker installed and configured (depalletization IoT Agent and Orion Context Broker are reachable in terms of a network)
* (optional) data consumer/visualization component e.g. FI-WARE Quantum Leap generic enabler with CrateDB and Grafana dashboard ([setup tutorial](https://documenter.getpostman.com/view/513743/RWEnkvDc))
​
## Initial RS232 to Ethernet hardware gateway setup
​
Is is required that RS-232 Converter and machine use the same serial port communication settings for: 
​
* Baudrate
* Data Bits
* Parity
* Stop (Bits)
​
Additionally You can set UART Autoframe on Enable and set Autoframe Time for 5000. Setting the correct hardware connection between  is beyond the scope of this manual
​
​
## Configuration
​
In order to use the Depalletization IoT Agent with legacy production machines using RS232 connection an administrator needs provide connection cofigiration within `config.js` file including both harwadware RS232-to-Eth gateway/converter:  
​
- in `config.js` file you must set **rs_host** and **rs_port** variables (default *10.10.100.254* and *8899*) representing RS232-to-Eth gateway IP address and TCP port respectively.

and the Orion Context Broker:  
​
- in `config.js` file you must set **adress** and **port** of *contextBroker* object
- in `iotagent.js` file you must change name KUKA in `/v2/entities/KUKA/attrs` to name of your entity​​
​
## Machine data model setup 

### KUKA example: 
The Depalletization IoT Agent data model must be compatible with data model prodived by machine/robot program. Currently, the agent is configured to support custom KUKA KR240 robot program providing the following basic data:

* ID of pile (`ID PACK: number`) e.g. uniqe pallet identifier 
* layer thickness (`THICK TIM: number`) (must be the same unit as thickness of a pile)
* layer witdh (`WIDTH TIM: number`) (must be the same unit as width of a pile)
* height of a pile (`HEIGHT: number`)
* robot start/end a layer (`WRST: bool`) (1 when robot start to move a layer and 0 when it ends)

#### HTTP socket response (ASCII)
Example of HTTP socket reposnse in ASCII format from robot: `ID PACK=19811.THICK TIM=45.WIDHT TIM=600.WRST=1.HEIGHT=200`

The Depalletization IoT Agent uses basic machine data to calculate addtional data about depalletization process performance such as:

* total number of layers for depalletization -number of layers in a pile (`totalCarrierLayers: number`)
* total number of completed layers - number of layers already depalletized (`totalCarrierLayersCompleted: number`)
* total depalletization progress - % of layers unloaded (`carrierLayersProgress: number`)
* approx. time to finish depalletization progress - time remaining in minutes (`carrierTimeRemaining: number`)
* total time of depalletization process - time spend in miunutes (`startPaletteProcessingTime: number`)
* last process state change (timestamp of last data change (`lastStateChange: number/timestamp`) 


### STACKER example
Palletization process supported by autoamted stacker and the agent is based on the following basic data:

* number of items wihtin one pile layer (`boardCount: number`)
* pile layer processing start time (`startTime: DateTime`)
* pile layer processing end time (`endTime: DateTime`)
* machine status (`isRunning: bool`)


### NGSI contex data example (json)
The following exmaple presents three entities avaialble in Orion Context Broker when using depalletization agent. 
* KUKA:KUKA1 - entity providing context data including Kuka depalletization process data 
* STACKER:STACKER1 - entity providing context data including automatic stacker palletization process data 
* KUKA_SCANER_DATA - - entity providing context data including Kukla depalletization robot configuration

```json
"curl [ip_address]:[port]/v2/entities[
   {
      "id":"KUKA:KUKA1",
      "type":"KUKA",
      "active":{
         "type":"Boolean",
         "value":false,
         "metadata":{
            
         }
      },
      "carrierId":{
         "type":"Number",
         "value":18664,
         "metadata":{
            
         }
      },
      "carrierLayersProgress":{
         "type":"Number",
         "value":-300,
         "metadata":{
            
         }
      },
      "carrierTimeRemaining":{
         "type":"Number",
         "value":0,
         "metadata":{
            
         }
      },
      "lastStateChange":{
         "type":"Number",
         "value":1606967530617,
         "metadata":{
            
         }
      },
      "startPaletteProcessingTime":{
         "type":"Number",
         "value":0,
         "metadata":{
            
         }
      },
      "totalCarrierLayers":{
         "type":"Number",
         "value":-10,
         "metadata":{
            
         }
      },
      "totalCarrierLayersCompleted":{
         "type":"Number",
         "value":30,
         "metadata":{
            
         }
      }
   },
   {
      "id":"Stacker:Stacker1",
      "type":"Stacker",
      "boardCount":{
         "type":"Number",
         "value":8,
         "metadata":{
            
         }
      },
      "endTime":{
         "type":"DateTime",
         "value":"2021-06-01T11:00:29.00Z",
         "metadata":{
            
         }
      },
      "isRunning":{
         "type":"Boolean",
         "value":true,
         "metadata":{
            
         }
      },
      "startTime":{
         "type":"DateTime",
         "value":"2021-06-01T11:00:19.00Z",
         "metadata":{
            
         }
      }
   },
   {
      "id":"KUKA_SCANER_DATA",
      "type":"KUKA",
      "carrierId":{
         "type":"Number",
         "value":0,
         "metadata":{
            
         }
      },
      "depth":{
         "type":"Number",
         "value":0,
         "metadata":{
            
         }
      },
      "width":{
         "type":"Number",
         "value":105,
         "metadata":{
            
         }
      }
   }
]
```


### Add new entity to Context Broker
If you would like to add new model you can use POST request on path `/api/addDevice/`
In a request body you must use this parameters:
​
```
id
type
attributes: (this is object with fields:)
- carrierId
- carrierLayersProgress
- carrierTimeRemaining
- lastStateChange
- startPaletteProcessingTime
- totalCarrierLayers
- totalCarrierLayersCompleted
```
​
## Multiple Orion Context Brokers support
The depalletization IoT Agent supports sending contextual data to multiple Orion Context Brokers instances. The If you would like to send data from a machine to more than 1 Orion Context Broker you must add in config.js file in config object another object with fields host and port. For example
​
```
anotherBroker { host: 1.2.3.4, port: 1234 }
```
