# Depalletization IoT Agent for RS232 and MODBUS TCP protocol
### ROSE-AP component supporting warehousing and production palletization processess

[![License: MIT](https://img.shields.io/github/license/ramp-eu/TTE.project1.svg)](https://opensource.org/licenses/MIT)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/4899/badge)](https://bestpractices.coreinfrastructure.org/projects/4899)

An IoT Agent for RS232 and MODBUS TCP protocol is designed to be a bridge between RS232 ASCII based custom protocol or MODBUS TCP protocol and the [NGSI](https://swagger.lab.fiware.org/?url=https://raw.githubusercontent.com/Fiware/specifications/master/OpenAPI/ngsiv2/ngsiv2-openapi.json) interface of a context broker. The agent is customized for supporting wareohusing and production palletization processess.

It is based on the IoT [Agent Node.js](https://github.com/telefonicaid/iotagent-node-lib) Library. Further general information about the FIWARE IoT Agents framework, its architecture and the common interaction model can be found in the library's GitHub repository.

This project is part of [DIH^2](http://www.dih-squared.eu/). For more information check the RAMP Catalogue entry for the
[components](https://github.com/xxx).

## Contents

-   [Background](#background)
-   [Install](#install)
-   [Usage](#usage)
-   [API](#api)
-   [Architecture](#architecture)
-   [Testing](#testing)
-   [License](#license)

## Background
This IoT Agent is designed to be a bridge between HTTP, ASCII based protocols or [MODBUS TCP protocol](https://www.modbus.org/docs/Modbus_Messaging_Implementation_Guide_V1_0b.pdf) and the FIWARE NGSI standard used in FIWARE. This project is based in the Node.js IoT Agent library. More information about the IoT Agents can be found within the library's [GitHub repository](https://github.com/telefonicaid/iotagent-node-lib).

The agent is designed to enable IoT capabilities for legacy production and warehousing machines supporting old-fashioned (but still popular) serial communication using RS232 connection and ASCII based data protocols. Additionally it supports MODBUS TCP protocol to retreive data form connected machines.  

The agent was tested on two machines: 
* KUKA KR150 robot using RS232 serial connection with additional serial-to-ethernet hardware gateway converter
* automated stacker using PLC controller connected to an ethernet, network supporitng MODBUS TCP protocol

### Smart factory services
Currently, the agent is customized to support warehousing and production palletization processess including:
* depalletization - is a process of removing materials from pallets or ordered pile
* palletization (stacking) - is a proces of arranging materials on pallets or in an ordered pile

Proposed solution allows access to palletization processess performance data in an automated manner. The new smart factory services include:
1. Real time production process monitoring – visualisation of machines’ current status, i.e. uptime, number of cycles completed, time to complete, etc.
2. Early warnings for production station status (monitoring) – sending notifications to shop-floor workers when the robot’s task is near to completion so there is no idling time
3. Autmatiozation of machines programs configuration 

In order to provide new business services, the CONTRA system will be extended with additional modules for
production machine reporting data visualization and analysis (statistics in a form of tables and charts). Moreover,
the CONTRA production planning module could be extended to take into account live reporting data rather than
predefined, static parameters values (e.g. machine performance parameters).

### Use Case description (depalletization)

1. A shop-floor worker uses WMS/MES system mobile appplication to scan palette barcode to initiate depalletization process (e.g. [CONTRA](https://contra.itti.com.pl/)) and configure machines accrodingly
2. A robot operator confirms received configuration and starts a robot
3. A robot begins depalletization
4. Performance data is 
5. he Orion Context Broker receives context data update (scanned, unique paletted ID and material dimmensions)

use-case

1. A KUKA robot operator receives a list of wood components that need to go through the thickness planner.
2. A KUKA robot operator enters correct attributes of the material to be processed in the robot's HMI operator panel.
3. A KUKA robot operator ensures there is raw material present in the marked zone.
4. A KUKA robot operator starts the robot.
5. The robot executes the program and transfers planks from the pallet onto to the roller conveyor.
* In the background, information such as: start/stop of the robot, pallet height, time of depellatisation of each layer is sent to the OCB and CONTRA.
* Based on this information CONTRA calculates estimated time for depalletisation process to complete.
* This information is updated every 1 minute.
* When there is 30% time left for depalletisation process to complete, a notification is pushed to the mobile device carried by the shop-floor worker operating a forklift.
6. The shop-floor worker confirms receiving the notification and delivers another batch of material in the buffer zone.
7. The process repeats from point 3.

### Proposed Solution

The proposed solution consists of hardware production machines already available in ACORD, hardware IoT
gateways, software IoT gateways, data flow infrastructure provided by the Orion Context Broker and CONTRA
WMS/MES system providing additional smart business services. Main beneficiaries of the proposed solution are
staff and managers responsible for optimal resources allocation and production planning. Secondary
beneficiaries of the solution are production workers currently responsible for manual reporting data directly on a
machine level.
From the **hardware perspective** it was assumed that automatic Stacker, Pushing saw OptiCut S90 XL and KUKA KR150 robot will be connected to the DIH² platform. Interoperability layer on hardware level has been provided by generic, commercial IoT smart communication gateway (i.e. USR-W610 Serial to WiFi Ethernet Converter RS232 RS485 Serial Server) compatible with machines' communication protocols.
On the **software level**, machines interoperability has been provided by custom software agent (RS232-IoT-Agent) acting as a middleware between hardware IoT gateway enabling serial to ethernet communication conversion and CONTRA system.  The NGSIv2 protocol support is provided as a outbound interface of the RS232-IoT-Agent.
In terms of DIH² platform software components, the Context Broker GE was used to provide an infrastructure for managing production line data flow to the CONTRA system. The CONTRA system integrated with Context Broker through NGSI API receives contextual production line data (e.g. number of executed machine programs/cycles in a given timeframe). Such an approach allows for easy scalability of the solution in the future - adding more machines or increasing data flow (due to scalability features of Context Broker) as well as reduces the need for extending CONTRA system of hardware integration functionalities and requirements for the system itself.



## Install

How to install the component

Information about how to install the Contra 2.0 can be found at the corresponding section of the
[Installation & Administration Guide](docs/installationguide.md).

A `Dockerfile` is also available for your use - further information can be found [here](docker/README.md)


## Usage

How to use the component

Information about how to use the Contra 2.0 can be found in the [User & Programmers Manual](docs/usermanual.md).

## Testing

For performing a tests you have to follow the step below. Tests are written in the [jest](https://jestjs.io) framework
```text
> npm test
```
## License

[MIT](LICENSE) © <TTE>
