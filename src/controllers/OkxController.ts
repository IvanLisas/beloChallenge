import { requestHandler } from '../handlers/errors/requestHandler'
import { Request, Response } from 'express'
import okxService from '../services/OkxService'
import { createEstimatedPriceDTO, EstimatedPriceDTO } from '../types/DTO/estimatedPriceDTO'
import { Pairs } from '../types/Pairs'
import { Operation } from '../types/Operation'
import { createSwapDTO, SwapDTO } from '../types/DTO/SwapDTO'

class OkxController {
  async placeOrder(req: Request, res: Response) {
    requestHandler<SwapDTO>(req, res, async () => {
      const swap = await okxService.placeOrder(req.body.estimatedPriceId)
      return createSwapDTO(swap)
    })
  }

  async optimalPrice(req: Request, res: Response) {
    requestHandler<EstimatedPriceDTO>(req, res, async () => {
      const { instId, volume, side } = req.query
      const optimalPrice = await okxService.optimalPrice(instId as Pairs, volume as string, side as Operation)
      return createEstimatedPriceDTO(optimalPrice)
    })
  }
}

const okxController = new OkxController()

export default okxController
