let express = require('express'),
	{clientRs232} = require('./../server')

const router = express.Router()

router
	.post('/write', (req,res) => {
		console.log(req.body)
		clientRs232.write(req.body.text)
		res.json('write')
	})
	.get('/start' ,(req, res) => {
		startConnect()
		res.json('connected')
	})
  	.get('/disconnect', (req, res) => {
		clientRs232.destroy()
		res.json('disconnected')
	})


module.exports = router