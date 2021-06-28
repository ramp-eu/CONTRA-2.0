# Concept 
In order to provide IoT capabliites of leagacy production or warehouse machines supporting only old-fashioned RS-232 serial communication the depalletization IoT Agentcomponent is provided. 
​

The Depalletization IoT Agent component is a node.js based middleware software solution deployed in between a hardware gateway enbaling serial to ethernet comunnication conversion and other software components (e.g. legacy ERP or WMS systems). 
​

The [NGSIv2](https://fiware.github.io/specifications/ngsiv2/stable/) portocol supoort is provided as a outbound interface of the RS232-IoT-Agent. Therefore, by default RS232-IoT-Agent provides data to the [Orion Context Broker](https://fiware-orion.readthedocs.io/en/master/) acting as a central message borker for other IT systems.
​
<img width="987" alt="Zrzut ekranu 2021-05-26 o 09 11 19" src="https://user-images.githubusercontent.com/46000321/119990198-5841be00-bfc8-11eb-9589-71faeb6fd75f.png">




# Architecture overview 
 The following picture shows the high-level architecture of the solution:
 
![](https://user-images.githubusercontent.com/17854328/100662415-26bba300-3355-11eb-8600-791a209ede59.png)
​
# Functional components 
The following functional components are used to provide IoT capabliites of leagacy production or warehouse machines:
* production machine - provides data using serial communication 
* hardware IoT gateway - converts RS232 serial data to ethernet data frames (e.g. USR W610 Serial to Ethernet converter)
* RS232-IoT-Agent - software middleware between machine (hardware IoT gateway)
* Orion Context Broker - NGSIv2 compatible message broker 
* Machines data consumers (context consumers) - e.g. production or warehouse applications, ERP, WMS or MES systems 
​
​
# RS232-IoT-Agent internal structure
- socket which connect app with RS232 app
- translateData function, which allows to translate data from KUKA robot to format readable for Context Broker
- update function which allows to send data from Iot Agent to Context Broker(s)
- function allows create new entity in Context Broker
​

## Gettting data from a machine (from hardware gateway)
The RS232-IoT-Agent supports HTTP, TCP/IP based communication for getting data from a hardware gateway (listening on specific TCP socket)
​
## Providing data to Orion Context Broker
The RS232-IoT-Agent supports RESTful NGSIv2 API to create and update machines contextual data
