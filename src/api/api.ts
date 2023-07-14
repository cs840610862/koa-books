import http from '../utils/axiosIntercept'

export const POST = (url: string, send: any): Promise<[any, any]> => {
  return http.post(url, send)
}