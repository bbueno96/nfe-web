import { onlyNumbers } from './format'

export const firstOrSelf = item => (Array.isArray(item) ? item[0] : item)

export function forceDownload(blob, name) {
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  document.body.appendChild(link)

  link.style.display = 'none'
  link.href = blobUrl
  link.download = name
  link.click()

  URL.revokeObjectURL(blobUrl)
}

export function classNames(...args) {
  const classes = []

  args.forEach(arg => {
    if (arg) {
      if (typeof arg === 'string' || typeof arg === 'number') {
        classes.push(arg)
      } else if (Array.isArray(arg) && arg.length) {
        const inner = classNames(...arg)

        if (inner) {
          classes.push(inner)
        }
      } else if (typeof arg === 'object' && arg !== null) {
        Object.entries(arg).forEach(([key, value]) => {
          if (value) {
            classes.push(key)
          }
        })
      }
    }
  })

  return classes.join(' ')
}

// Object
export const fillObject = (obj, value) =>
  Object.entries(obj).reduce((acc, [k, v]) => ({ ...acc, [k]: v instanceof Object ? fillObject(v, value) : value }), {})
export const Browser = {
  OPERA: 1,
  FIREFOX: 2,
  CHROME: 3,
  SAFARI: 4,
  IE: 5,
  OTHER: 6,
}
export function GetBrowserInfo() {
  const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0

  const isFirefox = typeof InstallTrigger !== 'undefined' // Firefox 1.0+
  const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0

  const isChrome = !!window.chrome && !isOpera // Chrome 1+
  const isIE = /* @cc_on!@ */ false || !!document.documentMode // At least IE6

  if (isOpera) {
    return Browser.OPERA
  }
  if (isFirefox) {
    return Browser.FIREFOX
  }
  if (isChrome) {
    return Browser.CHROME
  }
  if (isSafari) {
    return Browser.SAFARI
  }
  if (isIE) {
    return Browser.IE
  }

  return Browser.OTHER
}

const verifyNeedDownload = () => {
  const browser = GetBrowserInfo()
  return [Browser.FIREFOX, Browser.OTHER].some(arrVal => browser === arrVal)
}

export function iframeDownload(blob, name = 'relatorio.pdf') {
  if (verifyNeedDownload()) {
    forceDownload(blob, name)
  } else {
    const blobUrl = URL.createObjectURL(blob)
    let frame = window.document.querySelector('#pdf-frame')

    if (!frame) frame = document.createElement('iframe')

    frame.id = 'pdf-frame'
    frame.src = blobUrl
    frame.style.display = 'none'
    document.body.appendChild(frame)
    frame.contentWindow.print()
    URL.revokeObjectURL(blobUrl)
  }
}

export const getCnpj = cnpj => fetch(`https://publica.cnpj.ws/cnpj/${onlyNumbers(cnpj)}`).then(r => r.json())
