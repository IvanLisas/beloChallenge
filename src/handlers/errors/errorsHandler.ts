/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'
import GeneralError from '../../errors/ErrorGenerator'
import { ResponseBody } from '../../types/DTO/ResponseBody'
import { AxiosError } from 'axios'

const errorHandler = (error: any, res: Response) => {
  let statusCode = 500
  let message = 'Internal server error'
  console.log(error)
  if (error instanceof Error) {
    message = error.message
    // General Error
    if (error instanceof GeneralError) statusCode = error.code
    // Axios error
    else if (error instanceof AxiosError) {
      statusCode = error.response?.status || 500
      message = error.response?.data
    }
    //Express-validator error
    else if ((error as any).errors) {
      statusCode = 400
      message = (error as any).errors
    }
  }
  res.status(statusCode).send({ message: message, statusCode: statusCode } as ResponseBody)
}

export default errorHandler
