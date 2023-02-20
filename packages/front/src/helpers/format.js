export const onlyNumbers = txt => `${txt}`.replace(/[^\d]/g, '')
export const onlyAlphaNumeric = txt => `${txt}`.replace(/[^a-z0-9]/gi, '')
export const removeAccents = txt => txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
export const plateFormater = txt => {
  const letters = txt.substring(0, 3)
  const numbers = txt.substring(3)
  return `${letters}-${numbers}`
}

export const getAddress = cep => fetch(`https://viacep.com.br/ws/${onlyNumbers(cep)}/json`).then(r => r.json())

export const groupBy = (collection, accessor) => {
  const aggr = new Map()
  const getKey = ent => (accessor instanceof Function ? accessor(ent) : ent[accessor])

  collection.forEach(c => {
    const key = getKey(c)
    const list = aggr.get(key)

    if (list) {
      aggr.set(key, [...list, c])
    } else {
      aggr.set(key, [c])
    }
  })

  return aggr
}
