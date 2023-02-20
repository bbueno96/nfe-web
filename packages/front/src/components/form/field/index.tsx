import React from 'react'

import classNames from 'classnames'

interface FieldProps {
  label?: string
  className?: string
  htmlFor?: string
  children?: React.ReactNode
}

export function Field({ label, className, htmlFor, children }: FieldProps) {
  return (
    <div className={classNames('form-group', className)}>
      {label && (
        <label htmlFor={htmlFor} className="form-label">
          {label}
        </label>
      )}
      {children}
    </div>
  )
}
