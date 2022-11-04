import { Swap } from '../../entity/Swap'

export type SwapDTO = {
  id: string
  finalPrice: string | null
  executedPrice: string
  buyEstimatedPrice: string
  sellEstimatedPrice: string
}

export const createSwapDTO = (swap: Swap): SwapDTO => ({
  id: swap.id,
  finalPrice: swap.finalPrice,
  executedPrice: swap.executedPrice,
  buyEstimatedPrice: swap.estimatedPrice?.buy || '',
  sellEstimatedPrice: swap.estimatedPrice?.sell || ''
})
