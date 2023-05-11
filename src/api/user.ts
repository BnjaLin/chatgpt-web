import { get, post } from '@/utils/request'

/**
 * 客户登录
 * @param data
 * + username 手机号
 * + code 短信验证码
 * @returns
 */
export const login = <T>(data: { username: string; code: string }) => {
  return post<T>({ url: '/api/user/customerLogin', data: { ...data, belongs: import.meta.env.VITE_BELONGS } })
}

export const fetchCode = ({ username, type = 'mobileMessages' }: { username: string; type?: string }) => {
  return get({ url: '/api/user/sendAuthCode', data: { username, type } })
}
