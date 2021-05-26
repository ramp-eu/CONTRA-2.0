# Depalletization IoT Agent for RS232 and MODBUS TCP protocol
### ROSE-AP component supporting warehousing and production palletization processess

[![License: MIT](https://img.shields.io/github/license/ramp-eu/TTE.project1.svg)](https://opensource.org/licenses/MIT)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/4899/badge)](https://bestpractices.coreinfrastructure.org/projects/4899)

The Depalletization IoT Agent for RS232 and MODBUS TCP protocol is both infrastructural and functional component supporting warehousing and production (de)palletization processess. **It provides data about (de)palletization processss performance automated by machines** (e.g. approx. time remaining to finish a pile, number of remaining pile layers etc.)

An IoT Agent for RS232 and MODBUS TCP protocol is designed to be a bridge between RS232 ASCII based custom protocol or MODBUS TCP protocol and the [NGSI](https://swagger.lab.fiware.org/?url=https://raw.githubusercontent.com/Fiware/specifications/master/OpenAPI/ngsiv2/ngsiv2-openapi.json) interface of a context broker. 

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
The agent is designed to enable IoT capabilities for legacy production and warehousing machines supporting old-fashioned (but still popular) serial communication using RS232 connection and ASCII based data protocols. Additionally it supports MODBUS TCP protocol to retreive data form connected machines.  

The agent was tested on two warehouse machines: 
* KUKA KR150 robot using RS232 serial connection with additional serial-to-ethernet hardware gateway converter (e.g. USR W610)
* automated stacker using PLC controller connected to an ethernet, network supporitng MODBUS TCP protocol

This IoT Agent is designed to be a bridge between HTTP, ASCII based protocols or [MODBUS TCP protocol](https://www.modbus.org/docs/Modbus_Messaging_Implementation_Guide_V1_0b.pdf) and the FIWARE NGSI standard used in FIWARE. This project is based in the Node.js IoT Agent library. More information about the IoT Agents can be found within the library's [GitHub repository](https://github.com/telefonicaid/iotagent-node-lib).

### Smart factory services
Currently, the agent is customized to support warehousing and production palletization processess including:
* **depalletization** - is a process of removing materials from pallets or ordered pile
* **palletization (stacking)** - is a proces of arranging materials on pallets or in an ordered pile

Proposed solution allows access to palletization processess performance data in an automated manner. The new smart factory services include:
1. **Real time production process monitoring** – visualisation of machines’ current status, i.e. uptime, number of cycles completed, time to complete, etc.
2. **Early warnings for production station status (monitoring)** – sending notifications to shop-floor workers when the robot’s task is near to completion so there is no idling time
3. **Automatization of machines configuration** 

Exmaple of Grafana-based depalletization dashboard for a single machine:

<img width="1195" alt="Zrzut ekranu 2021-05-26 o 12 04 49" src="https://user-images.githubusercontent.com/46000321/119642076-a1eca600-be1a-11eb-894a-f88421638e40.png">


### Use Case description (depalletization)

1. Shop-floor worker uses WMS (Warehouse Management System) mobile appplication to scan palette barcode to initiate depalletization process (e.g. [CONTRA](https://contra.itti.com.pl/)) and configure machines accrodingly
2. Mobile WMS application updates machine configurtion context data in context broker (e.g. pallet ID, single item dimmensions)
3. The agent send configuration data to a robot
4. A robot receives configuration data 
5. A robot operator confirms received configuration (e.g. palette ID, wood plank height) and starts a robot
6. A robot begins depalletization process according to selected program
7. Basic depalletization data is provided by a robot to the agent during process execution 
8. Agent calculates derivative data based on basic data provided by a machine (calculates estimated time for depalletisation process to complet)
9. Agent updates depalletization context data to be consumed by a client application (e.g. Grafana dashboard) - data is updated every ~1 minute.
10. When there is 30% time left for depalletisation process to complete, a notification is pushed to the mobile device carried by the shop-floor worker operating a forklift.
11. 6. The shop-floor worker receives a notification and delivers another batch of material in the buffer zone of a robot.
12. The process repeats from point 1.

## Install

How to install the component

Information about how to install the Contra 2.0 can be found at the corresponding section of the
[Installation & Administration Guide](docs/installationguide.md).

A `Dockerfile` is also available for your use - further information can be found [here](docker/README.md)

## API

Information about the API of the component can be found in the [API documentation](https://github.com/itti-pl/depalletization-agent-rose-ap/blob/main/api/docs/api.md)

## Architecture

A description of the architecture can be found in the [Architecture documentation](https://github.com/itti-pl/depalletization-agent-rose-ap/blob/main/api/docs/architecture.md)

## Usage

How to use the component

Information about how to use the agnet can be found in the [User & Programmers Manual](docs/usermanual.md).

## Testing

For performing a tests you have to follow the step below. Tests are written in the [jest](https://jestjs.io) framework
```text
> npm test
```
## License

[MIT](LICENSE) © <TTE>
