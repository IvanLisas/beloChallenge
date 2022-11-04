import cors, { CorsOptions } from 'cors'
import express from 'express'

class ExpressService {
  expressApp = express()

  corsOptions: CorsOptions = { origin: '*', methods: '*' }

  constructor() {
    this.expressApp.use(express.json({ limit: '50mb' }))
    this.expressApp.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
    this.expressApp.use(cors(this.corsOptions))
  }
}

export const expressServer = new ExpressService().expressApp
