# Step-by-step tutorial

## What is depalletization IoT agent?
The Depalletization IoT Agent for RS232 and MODBUS TCP protocol is both infrastructural and functional component supporting warehousing and production (de)palletization processess. It provides data about (de)palletization processss performance automated by machines (e.g. approx. time remaining to finish a pile, number of remaining pile layers etc.)

An IoT Agent for RS232 and MODBUS TCP protocol is designed to be a bridge between RS232 ASCII based custom protocol or MODBUS TCP protocol and the NGSI interface of a context broker.

It is based on the IoT Agent Node.js Library. Further general information about the FIWARE IoT Agents framework, its architecture and the common interaction model can be found in the library's GitHub repository.

## Requirements
In order to run the Depalletization IoT Agent you need:

* Docker (Version 20.10.0+)
* Docker-compose (Version 1.29.0+)

## Actors
* Mock TCP server acting as a depalletization machine/robot?
* Depalletization IoT agent
* Orion Context Broker

## Test scenario 
TBD

## How it works?
> Agent is establishing a TCP connection with mock server.   
> Mock server updates depalletization data every 15s.   
> Mock server is pushing content to the agent through the TCP socket   
> Agent process data received from the mock server 
> Agent updates context data in the Orion Context Broker  

## step 1. Clone agent repository
Open a terminal and move into a folder in which to create the new folder containing the IoT Agent Testbed,

then run

    git clone "https://github.com/itti-pl/depalletization-agent-rose-ap/"

## step 2. Run the testbed

To launch the whole testbed:

    cd docker-demo
    docker-compose up -d

After that You can run:

    docker ps

to check if all the required components are running.

Running the docker-compose stack (without modifying it) creates the following situation:

![container structure](/docs/img/container_structure.png)

## step 3. Check if Orion context broker is working:

To check if Orion Context Broker is working, use command `curl 127.0.0.1:1026/version` - if You got response with version, then all is good.

## step 4. Initialize context data 
use command `source context-broker-schema.txt` or manually run curl from file `context-broker-schema.txt` 

This file contains curl with JSON schema for orion context broker

## step 5. to do sanity tests agent+mockserver 
run `docker-compose logs -f`

1. watch for logs like below, to verify that mockserver is up and working

- Logs below informs about:

  - Data is modified in mockserver

  > mockserver_1  | Modified:  ID PACK=19813.THICK TIM=100.WIDHT TIM=600.WRST=1.HEIGHT PACK=600.  
  > mockserver_1  |  

  - Data is sent to agent from mockserver 

  > mockserver_1  | sent: ID PACK=19813.THICK TIM=100.WIDHT TIM=600.WRST=1.HEIGHT PACK=600.  
  > mockserver_1  | 

2. watch for logs to verify that agent is working. Lines below shows that agent is working.

- Logs below informs about: 
  - data is recieved from server and object is built

  > agent_1       | data ID PACK=19813.THICK TIM=100.WIDHT TIM=600.WRST=1.HEIGHT PACK=700.  
  > agent_1       |  2021-06-14T10:00:07.983Z  
  > agent_1       | dataObject { 'ID PACK': '19813',  
  > agent_1       |   'THICK TIM': '100',  
  > agent_1       |   'WIDHT TIM': '600',  
  > agent_1       |   WRST: '1',  
  > agent_1       |   'HEIGHT PACK': '700' }  

  - parameters (time per layers, height from each layer, average time per layer) from this carrier 

  > agent_1       | info.layersTimes [ 20014, 10000, 20011 ] 20011  
  > agent_1       | info.heights [ 100, 100, 100 ] 2021-06-14T10:00:07.983Z  
  > agent_1       | averageTime 16 2021-06-14T10:00:07.983Z  
  > agent_1       | carrierTimeRemaining 1552  

  - update context in broker

  > agent_1       | dataUpdate: { totalCarrierLayers: { value: 100, type: 'Number' },  
  > agent_1       |   totalCarrierLayersCompleted: { value: 3, type: 'Number' },  
  > agent_1       |   carrierLayersProgress: { value: 3, type: 'Number' },  
  > agent_1       |   carrierTimeRemaining: { value: 25, type: 'Number' } }  

  - done update in configured broker

> agent_1       | 0 Broker update is done 2021-06-14T10:00:07.989Z  

## step 6. Check for updates in orion context broker:

- curl 127.0.0.1:1026/v2/entities/ - JSON looks like
```json
[
  {
    "id": "KUKA:KUKA1",
    "type": "KUKA",
    "active": {
      "type": "Boolean",
      "value": false,
      "metadata": {}
    },
    "carrierId": {
      "type": "Number",
      "value": 19813,
      "metadata": {}
    },
    "carrierLayersProgress": {
      "type": "Number",
      "value": 50,
      "metadata": {}
    },
    "carrierTimeRemaining": {
      "type": "Number",
      "value": 1,
      "metadata": {}
    },
    "lastStateChange": {
      "type": "Number",
      "value": 1606967530617,
      "metadata": {}
    },
    "startPaletteProcessingTime": {
      "type": "Number",
      "value": 1623757568616,
      "metadata": {}
    },
    "totalCarrierLayers": {
      "type": "Number",
      "value": 10,
      "metadata": {}
    },
    "totalCarrierLayersCompleted": {
      "type": "Number",
      "value": 5,
      "metadata": {}
    }
  }
]
```
- Below is json explained

> CarrierId - currently used pack  
> carrierLayersProgress - percentage of progress in this pack  
> carrierTimeRemaining - minutes to finish  
> totalCarrierLayers - total amount of layers  
> totalCarrierLayersCompleted - finished layers  

- monitor for changes in `totalCarrierLayersCompleted` or in `carrierLayersProgress`.