import cities from './cities.json'

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/gi, '')
    .toLowerCase()
}

export function getCityCode(cityName: string, uf: number) {
  const stateCities = cities.filter(city => city.state === uf)
  const city = stateCities.find(city => normalize(city.name) === normalize(cityName))
  return city?.id || 0
}
