import React from 'react'

export default function Loading() {
  return (
    <>
      <span className="spinner spinner-track spinner-primary mr-8" role="status" aria-hidden="true" />
      <span>Carregando...</span>
    </>
  )
}
