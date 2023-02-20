import React from 'react'
import DatePicker from 'react-datepicker'

import { useField } from 'formik'

import { classNames } from '../../../helpers/misc'

export default function DateInput({
  id,
  name,
  placeholder = 'DD/MM/YYYY',
  dateFormat = 'dd/MM/yyyy',
  minDate = null,
  maxDate = null,
  disabled = false,
  icon = 'fa fa-calendar-alt',
  // isClearable,
}) {
  const [field, meta, helpers] = useField(id || name)
  const hasError = meta.touched && meta.error
  // const canClear = value !== null && !disabled && isClearable

  return (
    <div className={classNames({ 'kt-input-icon kt-input-icon--left': icon })}>
      <DatePicker
        className={classNames('form-control form-control', {
          'is-invalid': hasError,
        })}
        placeholder={placeholder}
        dateFormat={dateFormat}
        maxDate={maxDate}
        minDate={minDate}
        disabled={disabled}
        onChange={helpers.setValue}
        selected={typeof field.value === 'string' ? new Date(field.value) : field.value}
      />
      {icon && (
        <span className="kt-input-icon__icon">
          <i className={icon} />
        </span>
      )}
      {/*
      {canClear && (
        <span role="button" onClick={() => onChange(null)}>
          <i className="fa fa-times" />
        </span>
      )} */}

      {hasError && <div className="form-text text-danger">{meta.error}</div>}
    </div>
  )
}
