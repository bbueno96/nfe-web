import React from 'react'

import classNames from 'classnames'
interface PaginationProps {
  current: number
  total: number
  changePage: (page: number) => void
}

export const Pagination = ({ current, total, changePage }: PaginationProps) => {
  const pages = total <= 1 ? [1] : pagesRange(current, total, 3)
  return total < 2 ? null : (
    <ul className="kt-datatable__pager-nav">
      <li>
        <button
          type="button"
          disabled={current === 1}
          onClick={() => changePage(1)}
          className={classNames('kt-datatable__pager-link kt-datatable__pager-link--first', {
            'kt-datatable__pager-link--disabled': current === 1,
          })}
        >
          <i className="fas fa-angle-double-left" aria-hidden="true" />
        </button>
      </li>
      <li>
        <button
          type="button"
          disabled={current === 1}
          onClick={() => changePage(current - 1)}
          className={classNames('kt-datatable__pager-link kt-datatable__pager-link--prev', {
            'kt-datatable__pager-link--disabled': current === 1,
          })}
        >
          <i className="fas fa-angle-left" aria-hidden="true" />
        </button>
      </li>

      {pages.map(num => (
        <li key={num}>
          <button
            type="button"
            className={classNames('kt-datatable__pager-link kt-datatable__pager-link-number', {
              'kt-datatable__pager-link--active': num === current,
            })}
            aria-label={`Página ${num}`}
            aria-current="page"
            onClick={() => changePage(num)}
            disabled={num === current}
          >
            {num}
          </button>
        </li>
      ))}

      <li>
        <button
          type="button"
          disabled={current === total}
          onClick={() => changePage(current + 1)}
          className={classNames('kt-datatable__pager-link kt-datatable__pager-link--next', {
            'kt-datatable__pager-link--disabled': current === total,
          })}
        >
          <i className="fas fa-angle-right" aria-hidden="true" />
        </button>
      </li>
      <li>
        <button
          type="button"
          disabled={current === total}
          onClick={() => changePage(total)}
          className={classNames('kt-datatable__pager-link kt-datatable__pager-link--last', {
            'kt-datatable__pager-link--disabled': current === total,
          })}
        >
          <i className="fas fa-angle-double-right" aria-hidden="true" />
        </button>
      </li>
    </ul>
  )
}

function pagesRange(currentPage: number, total: number, delta = 2) {
  const middle = Math.min(Math.max(currentPage, delta + 1), total - delta)
  const start = Math.max(middle - delta, 1)
  const end = middle + delta
  return Array(Math.ceil(end - start + 1))
    .fill(start)
    .map((x, y) => x + y)
}
