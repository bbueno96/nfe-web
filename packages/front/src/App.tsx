/* eslint-disable react/react-in-jsx-scope */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { addHours, isAfter } from 'date-fns'

import service from '@nfe-web/axios-config'

import { Modal } from './components/modal'
import { appConfig } from './config'
import { useInterval } from './hooks/interval'
import { useLocalStorage } from './hooks/local-storage'

export interface ModalState {
  type?: 'alert' | 'confirm' | 'prompt'
  title?: string
  message?: string
  value?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: (value: any) => void
  show: boolean
}

interface Parameter {
  id?: string
  nfeRazao?: string
  getApoio?: boolean
}
interface Operator {
  name?: string
  roles?: string[]
}
interface AdminLoginValues {
  login: string
  password: string
}
interface AppContext {
  operator: Operator
  token: string
  saOperator: Operator
  saToken: string
  parameter: Parameter
  saSignIn: (values: AdminLoginValues) => Promise<void>
  saSignOut: () => void
  modal: {
    alert: (message: string, callback?: VoidFunction) => void
    confirm: (message: string, callback?: (confirmed: boolean) => void) => void
    prompt: (title: string, message: string, callback?: VoidFunction) => void
  }
}

const initialOperator = {} as Operator
const initialParameter = {} as Parameter
const AppContext = createContext<AppContext>({
  token: '',
  saSignIn: () => Promise.resolve(),
  saSignOut: () => undefined,
  modal: { alert: () => undefined, confirm: () => undefined, prompt: () => undefined },
  operator: initialOperator,
  saOperator: initialOperator,
  parameter: initialParameter,
  saToken: '',
})
export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {
  const [operator] = useLocalStorage<Operator>(appConfig.OPERATOR_KEY, {})
  const [token] = useLocalStorage(appConfig.TOKEN_KEY, '')

  const [saOperator, setSaOperator] = useLocalStorage<Operator>(`sa_${appConfig.OPERATOR_KEY}`, {})
  const [parameter, setParameter] = useLocalStorage<Parameter>(`parameter`, { getApoio: false })
  const [saToken, setSaToken] = useLocalStorage(`sa_${appConfig.TOKEN_KEY}`, '')
  const [saTokenExpires, setSaTokenExpires] = useLocalStorage<Date | null>(`sa_${appConfig.TOKEN_KEY}_expiresAt`, null)

  const [modal, setModal] = useState<ModalState>({ show: false })
  const modalActions = useMemo(
    () => ({
      alert: (message: string, callback?: VoidFunction) => setModal({ type: 'alert', message, callback, show: true }),

      confirm: (message: string, callback?: (confirmed: boolean) => void) =>
        setModal({ type: 'confirm', message, callback, show: true }),

      prompt: (title: string, message: string, callback?: VoidFunction) =>
        setModal({ type: 'prompt', message, callback, title, show: true }),
    }),
    [],
  )
  const saSignIn = useCallback(
    async values => {
      const { data } = await service.post('/login.admin', values)
      setSaTokenExpires(addHours(new Date(), 20))
      setSaOperator({ ...data.user, roles: data.user.isTest ? ['Admin', 'AdminTest'] : ['Admin'] })
      setSaToken(data.accessToken)
      const { data: parameters } = await service.post(
        '/parameter.get',
        {},
        { headers: { Authorization: `Bearer ${data.accessToken}` } },
      )
      setParameter({ id: parameters.id, nfeRazao: parameters.nfeRazao, getApoio: parameters.getApoio })
    },
    [setSaOperator, setSaToken, parameter],
  )

  const saSignOut = useCallback(() => {
    setSaTokenExpires(null)
    setSaToken('')
    setSaOperator({})
    setParameter({})
  }, [setSaOperator, setSaToken, setSaTokenExpires, setParameter])

  useInterval(
    () => {
      const isSaTokenExpired = (saTokenExpires && !isAfter(new Date(saTokenExpires), new Date())) || !saTokenExpires

      if (isSaTokenExpired) {
        saSignOut()
      }
    },
    saTokenExpires ? 1e3 : null,
  )

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <AppContext.Provider
      value={{ operator, saOperator, saSignIn, saSignOut, saToken, token, modal: modalActions, parameter }}
    >
      {children}

      <Modal
        type={modal.type}
        message={modal.message}
        title={modal.title}
        value={modal.value}
        show={modal.show}
        setModal={setModal}
      />
    </AppContext.Provider>
  )
}
