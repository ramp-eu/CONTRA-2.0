let express = require('express'),
    rs232Router = require('./rs232Routes')
    cbRouter = require('./cbRoutes')

const router = express.Router()

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, responseType  ')
  next()
}

router.use('/rs232', rs232Router)
router.use('/cb', cbRouter)


module.exports = {
    allowCrossDomain,
    router
  }