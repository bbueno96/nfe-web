export class KeyInfo {
  file: string
  key: string

  constructor(file: string, key: string) {
    this.key = key
    this.file = file
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '')
      .replace(/\s/g, '')
  }

  getKeyInfo = function () {
    return `<X509Data><X509Certificate>${this.file}</X509Certificate></X509Data>`
  }

  getKey = function () {
    return this.key
  }
}
