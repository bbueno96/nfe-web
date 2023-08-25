/* eslint-disable import/no-duplicates */
import format from 'date-fns-tz/format'
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'
import addMonths from 'date-fns/addMonths'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths'
import endOfMonth from 'date-fns/endOfMonth'
import endOfWeek from 'date-fns/endOfWeek'
import isValid from 'date-fns/isValid'
import locale from 'date-fns/locale/pt-BR'
import parse from 'date-fns/parse'
import setMonth from 'date-fns/setMonth'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import subMonths from 'date-fns/subMonths'

export function parseDate(value, dateFormat) {
  const date = parse(value, dateFormat, null, { locale })
  return isValid(date) ? date : null
}

export function formatDate(date, dateFormat) {
  if (!date) return ''
  const isString = typeof date === 'string'
  const parsedDate = isString ? zonedTimeToUtc(date, 'UTC') : date
  return format(parsedDate, dateFormat, { locale })
}

export const getMonthName = month => {
  const monthName = formatDate(setMonth(new Date(), month), 'LLLL')
  return monthName.charAt(0).toUpperCase() + monthName.slice(1)
}

export const getDayOfWeekCode = day => formatDate(day, 'ddd')
export const toLocaleDate = date => formatDate(date, 'dd/MM/yyyy')
export const toLocaleDateTime = date => formatDate(date, 'dd/MM/yyyy HH:mm:ss')
export const toLocaleTime = date => formatDate(date, 'HH:mm')

export const getMonthInfo = dateView => ({
  start: startOfWeek(startOfMonth(dateView)),
  end: endOfWeek(endOfMonth(dateView)),
})

export const isDayDisabled = (day, minDate, maxDate) =>
  (minDate && differenceInCalendarDays(day, minDate) < 0) || (maxDate && differenceInCalendarDays(day, maxDate) > 0)

export const monthDisabledBefore = (day, minDate) =>
  minDate && differenceInCalendarMonths(minDate, subMonths(day, 1)) > 0

export const monthDisabledAfter = (day, maxDate) =>
  maxDate && differenceInCalendarMonths(maxDate, addMonths(day, 1)) > 0

export const isDateInutilizar = nfeDate =>
  nfeDate && new Date().getDay() < 11 && differenceInCalendarMonths(new Date(), new Date(nfeDate)) <= 1
