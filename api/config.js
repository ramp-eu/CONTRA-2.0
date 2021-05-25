let config = {
    logLevel: 'DEBUG',
    contextBrokerAcord: {
        host: '192.168.1.152',
        port: '1026'
    },
    contextBrokerVirtual: {
        host: '130.188.160.98',
        port: '1026'
    },
    server: {
        port: 4041,
        host: '0.0.0.0'
    },
    deviceRegistry: {
        type: 'memory'
    },
    types: {
        'Light': {
            url: '/',
            apikey: '',
            type: 'Light',
            commands: [],
            lazy: [
                {
                    name: 'luminescence',
                    type: 'Lumens'
                }
            ],
            active: [
                {
                    name: 'status',
                    type: 'Boolean'
                }
            ]
        }
    },
    service: 'openiot',
    subservice: '/',
    providerUrl: 'http://iot-agent:4041',
    deviceRegistrationDuration: 'P1M',
    defaultType: 'Light'
};
let modbus_port = 8899
let modbus_adress = '10.10.100.254'
let rs_port = 8899
let rs_adress = '192.168.1.44'

module.exports = {
    config,
    modbus_port,
    modbus_adress,
    rs_port,
    rs_adress
}