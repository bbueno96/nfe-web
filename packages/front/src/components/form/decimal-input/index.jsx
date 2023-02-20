import React, { useRef, useLayoutEffect, useState, useCallback } from 'react'

import { useField } from 'formik'

import { maskDecimal } from '../../../helpers/mask'
import { classNames } from '../../../helpers/misc'
import { parseNumber } from '../../../helpers/parse'
import { useEventCallback } from '../../../hooks/event-callback'

const getInputSelection = ({ selectionStart, selectionEnd }) => ({
  end: selectionEnd || 0,
  start: selectionStart || 0,
})

function setCaretPosition(element, pos) {
  if (document.activeElement === element) {
    const callback = () => element.setSelectionRange(pos, pos, 'none')

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(callback)
    } else {
      setTimeout(callback, 0)
    }
  }
}

function adjustDecimalCaret({ caretPosition, masked, text }) {
  const { length: maskedLen } = masked
  const { length } = text
  const pos = maskedLen - length + caretPosition
  const isNumericPos = /^\d+$/.test(masked[pos - 1])

  return isNumericPos ? pos : pos - 1
}

export default function DecimalInput({
  id,
  name,
  icon = '',
  acceptEnter = true,
  noSelect = false,
  precision = 2,
  disabled,
}) {
  const [field, meta, helpers] = useField(name || id)
  const [caret, setCaret] = useState(0)
  const inputRef = useRef(null)
  const hasError = meta.touched && !!meta.error

  const handleChange = useEventCallback(ev => {
    if (inputRef.current) {
      const { value: text } = ev.target
      const { end: caretPosition } = getInputSelection(inputRef.current)
      const divider = 10 ** precision
      const convertedValue = Math.min(parseNumber(text) / divider, Number.MAX_SAFE_INTEGER)
      const masked = maskDecimal(convertedValue, precision)

      setCaret(adjustDecimalCaret({ caretPosition, masked, text }))
      helpers.setValue(convertedValue)
    }
  })

  const handleFocus = useCallback(ev => !noSelect && ev.target.select(), [noSelect])
  const handleKeyDown = useCallback(ev => ev.keyCode === 13 && !acceptEnter && ev.preventDefault(), [acceptEnter])

  useLayoutEffect(() => {
    if (inputRef.current) {
      setCaretPosition(inputRef.current, caret)
    }
  })

  return (
    <>
      <div className={classNames({ 'kt-input-icon kt-input-icon--left': icon })}>
        <input
          type="tel"
          id={id}
          name={name}
          ref={inputRef}
          value={maskDecimal(field.value || 0, precision)}
          className={classNames('form-control form-control', { 'is-invalid': hasError })}
          onChange={handleChange}
          onBlur={field.onBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {icon && (
          <span className="kt-input-icon__icon">
            <i className={icon} />
          </span>
        )}
      </div>

      {hasError && <p className="help is-danger">{meta.error}</p>}
    </>
  )
}
