// import { JSEncrypt } from 'jsencrypt';

interface SendResponseOptions<T = any> {
  type: 'Success' | 'Fail'
  message?: string
  data?: T
}

export function sendResponse<T>(options: SendResponseOptions<T>) {
  if (options.type === 'Success') {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    })
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? 'Failed',
    data: options.data ?? null,
    status: options.type,
  })
}

// const publicKey =
// 	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDogWHDKTEyO2AofReHVuyFVXEan4842sRtIE6G3ytyQuWiITU0GnKdRBQUr9tchCfkkgMxwHDviMnG9YQ19xz/dneLPr0ADP1shGQH+8MD+W0aBEhY/xd+v7lgeP8fKaBwfbZrQtyxt0rL1vI1F1SwcY5353BxSokQpLfmA5KB2wIDAQAB';
// 加密
// export function encrypt(password : string) {
// 	const encryptor = new J
// 	encryptor.setPublicKey(publicKey); // 设置公钥
// 	return encryptor.encrypt(password); // 对需要加密的数据进行加密
// }
// export function encrypt(value: string) {
//   const encryptor = new JSEncrypt();
//   encryptor.setPublicKey(publicKey);
//   return encryptor.encrypt(value);
// }