import React from 'react'
import { Link } from 'react-router-dom'

import classNames from 'classnames'

interface ButtonProps {
  type?: 'submit' | 'button'
  loading?: boolean
  onClick?: (target: EventTarget) => void
  customClassName?: string
  icon?: string | null
  title?: string | null
  className?: string
  disabled?: boolean
}

function renderContent(loading: boolean, title: string | null, icon: string | null) {
  if (loading) {
    return (
      <>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        <span className="sr-only">Carregando...</span>
      </>
    )
  }

  return (
    <>
      {icon && <i className={icon} aria-hidden="true" />}
      {title && <span>{title}</span>}
    </>
  )
}

export const Button = ({
  type = 'submit',
  loading = false,
  onClick,
  customClassName,
  icon,
  title,
  className = 'btn',
  disabled,
}: ButtonProps) => {
  const buttonClassName = classNames(className, customClassName)

  function handleClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (onClick && typeof onClick !== 'string') {
      const { target } = ev
      ev.preventDefault()
      onClick(target)
    }
  }

  return typeof onClick === 'string' ? (
    <Link className={buttonClassName} to={onClick}>
      {renderContent(loading, title || '', icon || '')}
    </Link>
  ) : (
    <button type={type} disabled={disabled} className={buttonClassName} onClick={handleClick}>
      {renderContent(loading, title || '', icon || '')}
    </button>
  )
}
