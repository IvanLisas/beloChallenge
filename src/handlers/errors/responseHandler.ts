import { Response } from 'express'
import { ResponseBody } from '../../types/DTO/ResponseBody'

export const response200status = (message: string, res: Response) => {
  res.status(200).send({ message: message, statusCode: 200 } as ResponseBody)
}
