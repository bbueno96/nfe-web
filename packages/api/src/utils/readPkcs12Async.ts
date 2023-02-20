import pem from 'pem'

export function readPkcs12Async(
  bufferOrPath: string | Buffer,
  options: pem.Pkcs12ReadOptions,
): Promise<pem.Pkcs12ReadResult> {
  return new Promise((resolve, reject) =>
    pem.readPkcs12(bufferOrPath, options, (err, result) => {
      if (err) {
        return reject(err)
      }

      resolve(result)
    }),
  )
}
