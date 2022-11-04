import { Router } from 'express'
import okxController from '../controllers/OkxController'
import { body, query } from 'express-validator'
import { validPairs } from '../config/Constanst'

const okxRouter = Router()

okxRouter.post('/place-order', body('estimatedPriceId').isUUID(), okxController.placeOrder)

okxRouter.get(
  '/optimal-price',
  query('instId').isIn(validPairs),
  query('volume').isNumeric(),
  query('side').isIn(['buy', 'sell']),
  okxController.optimalPrice
)

export default okxRouter
