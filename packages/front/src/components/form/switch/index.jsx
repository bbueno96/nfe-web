import React from 'react'

import { useField } from 'formik'

export default function SwitchInput({ id, name }) {
  const fieldName = id || name
  const [field] = useField({ name: fieldName, type: 'checkbox' })

  return (
    <span className="kt-switch">
      <label htmlFor={fieldName}>
        <input
          id={fieldName}
          name={fieldName}
          type="checkbox"
          checked={field.checked}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
        <span />
      </label>
    </span>
  )
}
