/* eslint-disable react/react-in-jsx-scope */
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import ScrollBar from 'react-perfect-scrollbar'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import classNames from 'classnames'

import { useApp } from '../../App'
import { firstOrSelf } from '../../helpers/first-or-self'
import { useOnClickOutside } from '../../hooks/click-outside'
import { useRefresh } from '../../hooks/refresh'
import { useWindowSize } from '../../hooks/window-size'
import { Logo } from '../logo'
import { SingleMenuItem, DropdownMenuItem } from './MenuItem'

export interface PageProps {
  title: string
  path?: string | string[]
  icon?: string
  roles?: string[]
  element?: JSX.Element
  pages?: Pick<PageProps, 'title' | 'path' | 'element' | 'roles'>[]
}

interface PanelProps {
  type: 'sa' | 'employee'
  home?: JSX.Element
  pages: PageProps[]
  userPages?: PageProps[]
  routes?: PageProps[]
}

export const Panel = ({ type, home, pages, userPages = [], routes = [] }: PanelProps) => {
  const app = useApp()

  const { pathname: actualPath } = useLocation()
  const isSuperAdmin = type === 'sa'
  const basename = ''
  const operator = isSuperAdmin ? app.saOperator : app.operator
  const token = isSuperAdmin ? app.saToken : app.token

  if (!token) {
    return <Navigate to="login" />
  }

  const windowSize = useWindowSize()
  const userMenuRef = useRef(null)
  const boxRef = useRef(null)
  const sidebarRef = useRef<HTMLElement>()
  const refresh = useRefresh()
  const [userOpened, setUserOpened] = useState(false)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [topbarOpened, setTopbarOpened] = useState(false)
  const panelTitle = /** city ? city.fullName : */ app.parameter.nfeRazao

  const closeUserMenu = useCallback(() => setUserOpened(false), [setUserOpened])

  useOnClickOutside(userMenuRef, closeUserMenu)

  const hasBoxRef = Boolean(boxRef.current)
  const sidebarHeight = useMemo(() => {
    if (hasBoxRef) {
      const box = boxRef.current
      return windowSize.width > 1000 ? box.offsetHeight - 30 : windowSize.height
    }

    return 'auto'
  }, [windowSize, hasBoxRef, refresh.ref])

  useEffect(() => {
    setUserOpened(false)
    setSidebarOpened(false)
    setTopbarOpened(false)
  }, [actualPath])

  const allPages = pages
    .concat(userPages)
    .concat(routes)
    .filter(({ roles }) => !roles || (roles && operator.roles && operator.roles.map(role => roles.includes(role))))
    .flatMap(i => ('pages' in i ? i.pages : i))
    .filter(p => !firstOrSelf(p.path).match('https?://'))

  const now = new Date()

  return (
    <>
      <div className="kt-header-mobile kt-header-mobile--fixed">
        <div className="kt-header-mobile__logo">
          <Link to={basename}>
            <Logo />
            <span>{panelTitle}</span>
          </Link>
        </div>
        <div className="kt-header-mobile__toolbar">
          <button
            type="button"
            className="kt-header-mobile__toolbar-toggler kt-header-mobile__toolbar-toggler--left"
            onClick={() => setSidebarOpened(true)}
          >
            <span />
          </button>
          <button
            type="button"
            className="kt-header-mobile__toolbar-topbar-toggler"
            onClick={() => setTopbarOpened(x => !x)}
          >
            <i className="fas fa-ellipsis-h" />
          </button>
        </div>
      </div>

      <div
        id="grid-root"
        className={classNames('kt-grid kt-grid--hor kt-grid--root', {
          'kt-header__topbar--mobile-on': topbarOpened,
          'kt-aside--on': sidebarOpened,
        })}
      >
        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper">
            <div className="kt-header kt-grid__item kt-header--fixed">
              <div className="kt-container">
                <div className="kt-header__brand">
                  <div className="kt-header__brand-logo">
                    <Link to={basename}>
                      <Logo />
                      <span>{panelTitle}</span>
                    </Link>
                  </div>
                </div>
                <div className="kt-header__topbar">
                  <div
                    ref={userMenuRef}
                    className={classNames('kt-header__topbar-item kt-header__topbar-item--user', {
                      show: userOpened,
                    })}
                    onClick={() => setUserOpened(true)}
                  >
                    <div className="kt-header__topbar-wrapper">
                      <span className="kt-header__topbar-welcome kt-visible-desktop">Olá,</span>
                      <span className="kt-header__topbar-username kt-visible-desktop">
                        {operator.name.split(' ')[0]}
                      </span>
                      <span className="kt-header__topbar-icon kt-bg-brand">
                        <b>{operator.name.charAt(0)}</b>
                      </span>
                    </div>
                    <div
                      className={classNames(
                        'dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl',
                        { show: userOpened },
                      )}
                    >
                      <div className="kt-user-card kt-user-card--skin-light kt-notification-item-padding-x">
                        <div className="kt-user-card__avatar">
                          <span className="kt-badge kt-badge--username kt-badge--lg kt-badge--rounded kt-badge--bold">
                            {operator.name.charAt(0)}
                          </span>
                        </div>
                        <div className="kt-user-card__name">{operator.name}</div>
                      </div>
                      <div className="kt-notification">
                        {userPages.map(up => (
                          <Link key={up.title} className="kt-notification__item" to={basename + up.path}>
                            <div className="kt-notification__item-icon">
                              <i className={up.icon} aria-hidden="true" />
                            </div>
                            <div className="kt-notification__item-details">
                              <div className="kt-notification__item-title kt-font-bold">{up.title}</div>
                            </div>
                          </Link>
                        ))}

                        <div
                          style={userPages.length === 0 ? { borderTop: 'none' } : undefined}
                          className="kt-notification__custom justify-content-end"
                        >
                          <button type="button" className="btn btn-sm btn-bold btn-light" onClick={app.saSignOut}>
                            <i className="fas fa-sign-out-alt" />
                            Sair
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="kt-container kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-grid--stretch">
              <button type="button" className="kt-aside-close" onClick={() => setSidebarOpened(false)}>
                <i className="fas fa-times" />
              </button>

              <div
                ref={boxRef}
                className={classNames(
                  'kt-aside kt-aside--fixed kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop',
                  { 'kt-aside--on': sidebarOpened },
                )}
              >
                <div className="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid">
                  <ScrollBar
                    containerRef={el => {
                      sidebarRef.current = el
                    }}
                    className="kt-aside-menu kt-scroll"
                    style={{ height: sidebarHeight }}
                  >
                    <ul className="kt-menu__nav">
                      <li
                        className={classNames('kt-menu__item', {
                          'kt-menu__item--active': actualPath === basename,
                        })}
                        aria-haspopup="true"
                      >
                        <Link className="kt-menu__link" to={basename}>
                          <i className="kt-menu__link-icon fas fa-home" />
                          <span className="kt-menu__link-text">Dashboard</span>
                        </Link>
                      </li>

                      <li className="kt-menu__section">
                        <h4 className="kt-menu__section-text">Menu</h4>
                      </li>

                      {pages
                        .filter(
                          ({ roles }) =>
                            !roles || (roles && operator.roles && operator.roles.map(role => roles.includes(role))),
                        )
                        .map(p =>
                          'pages' in p ? (
                            <DropdownMenuItem
                              key={p.title}
                              page={p}
                              actualPath={actualPath}
                              basename={basename}
                              updateScroll={refresh.force}
                              sidebarElement={sidebarRef.current}
                            />
                          ) : (
                            <SingleMenuItem key={p.title} page={p} actualPath={actualPath} basename={basename} />
                          ),
                        )}
                    </ul>
                  </ScrollBar>
                </div>
              </div>

              {sidebarOpened && <div className="kt-aside-overlay" onClick={() => setSidebarOpened(false)} />}

              <div className="kt-holder kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
                <div className="kt-content kt-grid__item kt-grid__item--fluid">
                  <Routes>
                    <Route index element={home} />

                    {allPages.map(pg =>
                      typeof pg.path === 'string' ? (
                        <Route key={pg.path} path={pg.path} element={pg.element} />
                      ) : (
                        pg.path.map(singlePath => <Route key={singlePath} path={singlePath} element={pg.element} />)
                      ),
                    )}

                    <Route
                      path="*"
                      element={
                        <>
                          <div className="header">Erro 404 - Não Encontrado.</div>
                          <div className="content-sub-header">
                            A página que você solicitou não pôde ser encontrada, entre em contato com o administrador ou
                            tente novamente.
                          </div>
                        </>
                      }
                    />
                  </Routes>
                </div>
              </div>
            </div>
            <div className="kt-footer kt-grid__item">
              <div className="kt-container">
                <div className="kt-footer__wrapper">
                  <div className="kt-footer__copyright">
                    Todos os direitos reservados © {now.getFullYear()} - NFE Web
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
