import React from 'react'
import DatePicker from 'react-datepicker'

import { classNames } from '../../helpers/misc'

export default function DateInput({
  placeholder = 'DD/MM/YYYY',
  dateFormat = 'dd/MM/yyyy',
  minDate = null,
  maxDate = null,
  disabled,
  onChange,
  value,
  icon = 'fa fa-calendar-alt',
  // isClearable,
}) {
  return (
    <div className={classNames({ 'kt-input-icon kt-input-icon--left': icon })}>
      <DatePicker
        className={classNames('form-control', {})}
        placeholder={placeholder}
        dateFormat={dateFormat}
        maxDate={maxDate}
        minDate={minDate}
        disabled={disabled}
        onChange={onChange}
        selected={typeof value === 'string' ? new Date(value) : value}
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
    </div>
  )
}
