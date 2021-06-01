# User & Programmers Manual. 
​
## Prerequisites
In order to use depalletization IoT Agent for RS232 and MODBUS TCP protocol the following elements are required:
​
* machine supporting transparent RS232 communication, providing data in ACSII format. Currently, the RS232-IoT-Agent is configiured to support Custom KUKA KR240 robot ASCII based protocol (see [Data model setup](#Data)). 
* machine supoproting MODBUS TCP protocol
* hardware IoT gateway converting serial communication to ethernet (e.g. [USR W610](https://www.pusr.com/products/rs232/rs485-to-wifi-converters-usr-w610.html))
* depalletization IoT Agent installed and configured accordingly
* Orion Conext Broker installed and configured (reachable from the depalletization IoT Agent network)
* (optional) data consumer/visualization component e.g. Grafana dashboard 
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
- in `config.js` file you must set **rs_host** and **rs_port** variables (default *10.10.100.254* and *8899*)

and the Orion Context Broker:  
​
- in `config.js` file you must set **adress** and **port** of *contextBroker* object
- in `iotagent.js` file you must change name KUKA in `/v2/entities/KUKA/attrs` to name of your entity​​
​
## Machine data model setup 

### KUKA example: 
Depalletization IoT Agent data model must be compatible with data model prodived by machine/robot program. Currently, the Agent is configured to support custom KUKA KR240 robot program providing the following basic data:
​
​
* ID of pile (`ID PACK`) e.g. uniqe pallet identifier 
* layer thickness (`THICK TIM`) (must be the same unit as thickness of a pile)
* layer witdh (`WIDTH TIM`) (must be the same unit as width of a pile)
* height of a pile (`HEIGHT`)
* robot start/end a layer (`WRST`) (1 when robot start to move a layer and 0 when it ends)

Example of HTTP socket reposnse in ASCII format from robot: `ID PACK=19811.THICK TIM=45.WIDHT TIM=600.WRST=1.HEIGHT=200`

### STACKER example
[tbs]


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
