import React from 'react'
import DatePicker from 'react-datepicker'

import { classNames } from '~/core/helpers/misc'

export default function DateInput({
  placeholder = 'DD/MM/YYYY',
  dateFormat = 'dd/MM/yyyy',
  minDate = null,
  maxDate = null,
  disabled,
  onChange,
  value,
  // isClearable,
}) {
  return (
    <div className={classNames('input-icon', {})}>
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

      <span>
        <i className="fa fa-calendar-alt" />
      </span>
      {/*
      {canClear && (
        <span role="button" onClick={() => onChange(null)}>
          <i className="fa fa-times" />
        </span>
      )} */}
    </div>
  )
}
