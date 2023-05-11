import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'

export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal | AbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
  onMessage?: (text: string) => void
}

export interface Response<T = any> {
  code: number
  data: T
  message: string | null
  status: string
}

function http<T = any>(
  { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    if (res.data.code === 200)
      return res.data

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    throw new Error(error?.message || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

  return method === 'GET'
    ? request.get(url, { params, signal, onDownloadProgress }).then(successHandler, failHandler)
    : request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
}

export function get<T = any>(
  { url, data, method = 'GET', onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function streamFetch({ url, data, method = 'POST', signal, onMessage }: HttpOption): Promise<any> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: signal as AbortSignal,
      })
      const reader = res.body?.getReader()
      if (!reader)
        return

      const decoder = new TextDecoder()

      let responseText = ''

      const read = async () => {
        try {
          const { done, value } = await reader?.read()
          if (done) {
            if (res.status === 200) {
              resolve(responseText)
            }
            else {
              const parseError = JSON.parse(responseText)
              reject(parseError?.message || '请求异常')
            }
            return
          }

          const text = decoder.decode(value).replace(/<br\/>/g, '\n')
          responseText += text
          onMessage && onMessage(text)
          read()
        }
        catch (err: any) {
          if (err?.message === 'The user aborted a request.')
            return resolve(responseText)

          // eslint-disable-next-line no-mixed-operators
          reject(typeof err === 'string' ? err : err?.message || '请求异常')
        }
      }
      read()
    }
    catch (err: any) {
      // eslint-disable-next-line no-mixed-operators
      reject(typeof err === 'string' ? err : err?.message || '请求异常')
    }
  })
}

export default post
