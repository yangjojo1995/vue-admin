import JSEncrypt from 'jsencrypt'
import CONFIG from '@/config'

function encrypt (content, key) {
  const cryptor = new JSEncrypt()
  cryptor.setPublicKey(key || CONFIG.RSA_PUBLIC_KEY)
  return cryptor.encrypt(content)
}

window.encrypt = encrypt

export default JSEncrypt
export { JSEncrypt, encrypt }
