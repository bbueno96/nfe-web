/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

import classNames from 'classnames'

import { PageProps } from '.'
import { useApp } from '../../App'
import { firstOrSelf } from '../../helpers/first-or-self'
import { usePrevious } from '../../hooks/previous'

interface SingleMenuItemProps {
  page: PageProps
  actualPath: string
  basename: string
}

interface DropdownMenuItemProps {
  page: PageProps
  actualPath: string
  basename: string
  updateScroll: VoidFunction
  sidebarElement?: HTMLElement
}

export const SingleMenuItem = ({ page, actualPath, basename }: SingleMenuItemProps) => {
  const href = firstOrSelf(page?.path || '')
  const isExternal = !!href.match('https?://')
  const to = isExternal ? href : basename + href

  return (
    <li
      className={classNames('kt-menu__item', {
        'kt-menu__item--active': actualPath.includes(href),
      })}
    >
      <Link className="kt-menu__link" to={to} target={isExternal ? '_blank' : undefined}>
        <i className={classNames(page.icon, 'kt-menu__link-icon')} />
        <span className="kt-menu__link-text">{page.title}</span>
      </Link>
    </li>
  )
}

export const DropdownMenuItem = ({
  page,
  actualPath,
  updateScroll,
  basename,
  sidebarElement,
}: DropdownMenuItemProps) => {
  const { operator } = useApp()
  const isActive = page?.pages?.some(p => actualPath.includes(firstOrSelf(p?.path || '')))
  const wasActive = usePrevious(isActive)
  const [opened, setOpened] = useState<boolean>(isActive || false)
  const [scrollTop, setScrollTop] = useState<number>(0)

  useEffect(() => {
    if (wasActive && !isActive) {
      setOpened(false)
    }
  }, [isActive])

  useEffect(updateScroll, [opened])
  useEffect(() => {
    sidebarElement?.scroll({ top: scrollTop, behavior: 'smooth' })
  }, [opened, scrollTop])

  const handleButtonClick = useCallback((ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    setOpened(prev => !prev)

    const { target } = ev

    let parent = (target as HTMLButtonElement).parentNode as HTMLDivElement
    if (!parent.classList.contains('kt-menu__item')) parent = parent.parentNode as HTMLDivElement

    setScrollTop(parent.offsetTop)
  }, [])

  return (
    <li
      className={classNames('kt-menu__item kt-menu__item--submenu', {
        'kt-menu__item--open': opened,
      })}
      aria-haspopup="true"
    >
      <button type="button" onClick={handleButtonClick} className="kt-menu__link kt-menu__toggle">
        <i className={classNames(page.icon, 'kt-menu__link-icon')} />
        <span className="kt-menu__link-text">{page.title}</span>
        <i className="kt-menu__ver-arrow fas fa-angle-right" />
      </button>
      <div className="kt-menu__submenu">
        <ul className="kt-menu__subnav">
          {page?.pages
            ?.filter(
              ({ roles }) => !roles || (roles && operator?.roles && operator?.roles.map(role => roles.includes(role))),
            )
            .map(p => (
              <li
                key={firstOrSelf(p?.path || '')}
                aria-haspopup="true"
                className={classNames('kt-menu__item', {
                  'kt-menu__item--active': actualPath.includes(firstOrSelf(p.path || '')),
                })}
              >
                <Link className="kt-menu__link" to={basename + firstOrSelf(p.path || '')}>
                  <i className="kt-menu__link-bullet kt-menu__link-bullet--dot">
                    <span />
                  </i>
                  <span className="kt-menu__link-text">{p.title}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </li>
  )
}
