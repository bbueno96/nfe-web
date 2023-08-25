/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import { useApp } from '../../App'
import { Button } from '../../components/button'
import { ErrorMessage } from '../../components/form/error-message'
import { TextInput } from '../../components/form/text-input'
import { Logo } from '../../components/logo'
import { RequiredMessage } from '../../helpers/constants'

interface AdminLoginValues {
  login: string
  password: string
}

export const AdminLogin = () => {
  const [globalError, setGlobalError] = useState<string | null>(null)
  const app = useApp()
  const { saSignIn } = app
  const pushTo = useNavigate()
  const form = useFormik<AdminLoginValues>({
    initialValues: { login: '', password: '' },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (app.saToken) {
      pushTo('/')
    }
  }, [app.saToken])

  function handleSubmit(values: AdminLoginValues) {
    saSignIn(values)
      .then(() => pushTo('/'))
      .catch(err => setGlobalError(err.response.data.message))
      .finally(() => form.setSubmitting(false))
  }

  const { values: entity } = form

  return (
    <FormikProvider value={form}>
      <div className="login-wrapper">
        <div className="login-box">
          <div className="logo">
            <Logo />
          </div>
          <form className="login-form" onSubmit={form.handleSubmit}>
            <div className="form-group validated">
              <TextInput
                id="login"
                autoComplete="login"
                placeholder="Usuário"
                customClassName="form-control-lg"
                icon="fas fa-user"
                value={entity.login}
              />
            </div>

            <div className="form-group validated">
              <TextInput
                acceptEnter
                id="password"
                type="password"
                placeholder="Senha"
                customClassName="form-control-lg"
                icon="fas fa-lock"
                value={entity.password}
                autoComplete="current-password"
              />
            </div>

            <div className="login-actions">
              <Button
                customClassName="btn-primary btn-lg btn-block"
                icon="fas fa-sign-in-alt"
                title="Entrar"
                loading={form.isSubmitting}
                disabled={form.isSubmitting}
              />
            </div>

            <ErrorMessage error={globalError} />
          </form>
        </div>
      </div>
    </FormikProvider>
  )
}

function validateForm(values: AdminLoginValues) {
  const errors: FormikErrors<AdminLoginValues> = {}

  if (!values.login) {
    errors.login = RequiredMessage
  }

  if (!values.password) {
    errors.password = RequiredMessage
  }

  return errors
}
