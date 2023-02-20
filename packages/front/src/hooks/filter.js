import { useState, useRef, useCallback } from 'react'

import get from 'lodash/get'
import set from 'lodash/set'

import { useEventCallback } from './event-callback'

function getValueForCheckbox(currentValue, checked, valueProp) {
  if (typeof currentValue === 'boolean') {
    return Boolean(checked)
  }

  let currentArrayOfValues = []
  let isValueInArray = false
  let index = -1

  if (!Array.isArray(currentValue)) {
    // eslint-disable-next-line eqeqeq
    if (!valueProp || valueProp == 'true' || valueProp == 'false') {
      return Boolean(checked)
    }
  } else {
    currentArrayOfValues = currentValue
    index = currentValue.indexOf(valueProp)
    isValueInArray = index >= 0
  }

  if (checked && valueProp && !isValueInArray) {
    return currentArrayOfValues.concat(valueProp)
  }

  if (!isValueInArray) {
    return currentArrayOfValues
  }

  return currentArrayOfValues.slice(0, index).concat(currentArrayOfValues.slice(index + 1))
}

export default function useFilters(initialValues) {
  const initial = useRef(initialValues)
  const [values, setValues] = useState(initialValues)
  const [filters, setFilters] = useState(initialValues)

  const handleSubmit = useEventCallback(event => {
    if (event.preventDefault) event.preventDefault()
    if (event.stopPropagation) event.stopPropagation()
    setFilters(values)
  })

  const handleChange = useEventCallback(event => {
    if (event.persist) event.persist()
    const target = event.target || event.currentTarget
    const { type, name, id, value, checked, options, multiple } = target
    const field = name || id
    let val = value

    if (/number|range/.test(type)) {
      const parsed = parseFloat(val)
      val = Number.isNaN(parsed) ? '' : parsed
    } else if (/checkbox/.test(type)) {
      val = getValueForCheckbox(get(values, field), checked, value)
    } else if (multiple) {
      val = Array.from(options)
        .filter(el => el.selected)
        .map(el => el.value)
    }

    setValues(prev => set({ ...prev }, field, val))
  })

  const resetFilters = useCallback(() => setValues(initial.current), [])

  return { filters, values, handleChange, handleSubmit, resetFilters, setValues }
}
