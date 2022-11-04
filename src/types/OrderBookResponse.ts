export type OrderResponse = { asks: Orders; bids: Orders; ts: string }

export type Orders = [Order]

export type Order = ['depthPrice', 'quantity', 'deprecated', 'numberOfOrders']

export type OrderBookResponse = OrderResponse[]
