/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import CriptoJs from 'crypto-js'
import { OrderReponse } from 'src/types/OrderResponse'
import { okAccessKey, okAccessPassphrase, okAccessSecret, okxUrl } from '../config/Enviroment'

class RequestService {
  createHeader(url: string, method: HttpMethod, body?: any) {
    return {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': okAccessKey,
      'OK-ACCESS-TIMESTAMP': new Date().toISOString(),
      'OK-ACCESS-PASSPHRASE': okAccessPassphrase,
      'x-simulated-trading': 1,
      'OK-ACCESS-SIGN': CriptoJs.enc.Base64.stringify(
        CriptoJs.HmacSHA256(new Date().toISOString() + method + url + (body ? JSON.stringify(body) : ''), okAccessSecret)
      )
    }
  }

  async get<T>(url: string, params?: any) {
    const urlAndParams = url + (params ? '?' + new URLSearchParams(params).toString() : '')
    const reponse = await axios.get<{ code: string; msg: string; data: [T] }>(okxUrl + urlAndParams, {
      headers: this.createHeader(urlAndParams, 'GET')
    })
    if (reponse.data.code !== '0') throw new Error(reponse.data.msg)
    return reponse.data
  }

  async post(url: string, body?: any) {
    const reponse = await axios.post<{ code: string; msg: string; data: [OrderReponse] }>(okxUrl + url, body, {
      headers: this.createHeader(url, 'POST', body)
    })
    if (reponse.data.code !== '0') throw new Error(reponse.data.data[0].sMsg)
    return reponse.data
  }
}

const requestService = new RequestService()

export default requestService

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
