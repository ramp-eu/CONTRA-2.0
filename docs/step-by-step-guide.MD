###Depalletization IoT Agent for RS232 and MODBUS TCP protocol

#### how to run?
1. run stack by using command `docker-compose up -d`
2. sanity tests OCB:
	- OCB:
		curl 127.0.0.1:1026/version - json response = OK
	- mongoDB: if OCB works, mongo must
3. use command `source context-broker-schema.txt` or manually run curls from file `context-broker-schema.txt` 
4. sanity tests agent+mockserver:
	- run `docker-compose logs -f`
	- watch for logs like below, to verify that mockserver is up and working

	> mockserver_1  | Modified:  ID PACK=19813.THICK TIM=100.WIDHT TIM=600.WRST=1.HEIGHT PACK=600.  
	> mockserver_1  |   
	> mockserver_1  | sent: ID PACK=19813.THICK TIM=100.WIDHT TIM=600.WRST=1.HEIGHT PACK=600.  
	> mockserver_1  | 

	- watch for logs to verify that agent is working. Lines below shows that agent is working.
	> agent_1       | data ID PACK=19813.THICK TIM=100.WIDHT TIM=600.WRST=1.HEIGHT PACK=700.  
	> agent_1       |  2021-06-14T10:00:07.983Z  
	> agent_1       | dataObject { 'ID PACK': '19813',  
	> agent_1       |   'THICK TIM': '100',  
	> agent_1       |   'WIDHT TIM': '600',  
	> agent_1       |   WRST: '1',  
	> agent_1       |   'HEIGHT PACK': '700' }  
	> agent_1       | info.layersTimes [ 20014, 10000, 20011 ] 20011  
	> agent_1       | info.heights [ 100, 100, 100 ] 2021-06-14T10:00:07.983Z  
	> agent_1       | averageTime 16 2021-06-14T10:00:07.983Z  
	> agent_1       | carrierTimeRemaining 1552  
	> agent_1       | dataUpdate: { totalCarrierLayers: { value: 100, type: 'Number' },  
	> agent_1       |   totalCarrierLayersCompleted: { value: 3, type: 'Number' },  
	> agent_1       |   carrierLayersProgress: { value: 3, type: 'Number' },  
	> agent_1       |   carrierTimeRemaining: { value: 25, type: 'Number' } }  
	> agent_1       |  Broker update is done 2021-06-14T10:00:07.989Z  

5. Check for updates in orion context broker:
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
	> CarrierId - currently used pack  
	> carrierLayersProgress - percentage of progress in this pack  
	> carrierTimeRemaining - minutes to finish  
	> totalCarrierLayers - total amount of layers  
	> totalCarrierLayersCompleted - finished layers  

	- You can see update every ~15 seconds in ``totalCarrierLayersCompleted` and in `CarrierLayersProgress`


!!!! This stack doesn't have configured volumes !!!!

#### How it works?
> Agent is establishing a connection with mock server. 
> Mockserver updates content every 15s.
> Mockserver is pushing content to the agent through the TCP socket
> Agent works on data from mock server and push it into Orion Context Broker
