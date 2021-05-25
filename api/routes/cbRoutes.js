let express = require('express'),
    iotAgentLib = require('iotagent-node-lib'),
    { config } = require('./../config')
let { initSouthbound } = require('./../iotAgent')

const router = express.Router()

iotAgentLib.activate(config, function(error) {
    if (error) {
        console.log('There was an error activating the IOTA');
        process.exit(1);
    } else {
      initSouthbound(function(error) {
          if (error) {
              console.log('Could not initialize South bound API due to the following error: %s', error);
          } else {
              console.log('Both APIs started successfully');
          }
      });
  }
  })

router
	.post('/addDevice', (req,res) => {
        if (req.body.id && req.body.type) {
            iotAgentLib.register({ id: req.body.id, type: req.body.type, attributes: req.body.attributes || []
                }, (res) => {
                    console.log(res)
                })
        }
		res.json('write')
	})


module.exports = router