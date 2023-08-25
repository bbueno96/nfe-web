import React, { forwardRef } from 'react'
import InputMask from 'react-input-mask'

import classNames from 'classnames'
import { useField } from 'formik'

import { useEventCallback } from '../../../hooks/event-callback'

interface TextInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id?: string
  type?: 'text' | 'email' | 'password'
  dataId?: string
  icon?: string
  name?: string
  customClassName?: string
  placeholder?: string
  disabled?: boolean
  mask?: string | Array<string | RegExp> | ((value: string) => string)
  value: string
  acceptEnter?: boolean
  autoComplete?: string
  loading?: boolean
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Input = forwardRef<never, TextInputProps>(({ mask, value, children, ...props }, ref) =>
  mask ? (
    <InputMask {...props} ref={ref} mask={mask instanceof Function ? mask(value || '') : mask} value={value || ''} />
  ) : (
    <input {...props} ref={ref} value={value || ''} />
  ),
)

Input.displayName = 'Input'

export const TextInput = forwardRef<never, TextInputProps>(
  (
    {
      id,
      dataId,
      icon,
      type = 'text',
      name,
      customClassName,
      placeholder,
      disabled,
      mask,
      acceptEnter,
      autoComplete,
      loading,
      onBlur,
    },
    ref,
  ) => {
    const [field, meta] = useField<string | undefined | null>(id || name || '')
    const handleBlur = useEventCallback<React.FocusEventHandler<HTMLInputElement>>(ev => {
      field.onBlur(ev)
      if (onBlur) onBlur(ev)
    })

    const hasError = meta.touched && meta.error

    return (
      <>
        <div
          className={classNames({
            'kt-input-icon kt-input-icon--left': !!icon,
            'kt-spinner kt-spinner--sm kt-spinner--success kt-spinner--right kt-spinner--input': loading,
          })}
        >
          <Input
            id={id}
            data-id={dataId}
            mask={mask}
            name={field.name}
            autoComplete={autoComplete}
            disabled={disabled}
            placeholder={placeholder}
            type={type}
            ref={ref}
            className={classNames('form-control', customClassName, { 'is-invalid': hasError })}
            onChange={field.onChange}
            onBlur={handleBlur}
            onKeyDown={ev => ev.key === 'Enter' && !acceptEnter && ev.preventDefault()}
            value={field.value ?? ''}
          />

          {icon && (
            <span className="kt-input-icon__icon">
              <span>
                <i className={icon} />
              </span>
            </span>
          )}
        </div>

        {hasError && <div className="form-text text-danger">{meta.error}</div>}
      </>
    )
  },
)

TextInput.displayName = 'TextInput'
