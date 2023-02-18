import sha256 from 'crypto-js/sha256'

export default function (string) {
  return sha256(string).toString()
}
