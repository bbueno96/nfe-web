/* eslint-disable react/react-in-jsx-scope */
import 'react-datepicker/dist/react-datepicker.css'
import './assets/css/style.css'

import { render } from 'react-dom'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import { AppProvider } from './App'
import { Panel } from './components/panel'
import { AccountPayableForm } from './pages/accountPayable/form'
import { AccountPayableList } from './pages/accountPayable/list'
import { AccountPaymentForm } from './pages/accountPayment/form'
import { AccountPaymentList } from './pages/accountPayment/list'
import { BankAccountList } from './pages/bankAccount/list'
import { BankRemittanceForm } from './pages/bankRemittance/form'
import { BankRemittanceList } from './pages/bankRemittance/list'
import { BrandList } from './pages/brand/list'
import { BudgetForm } from './pages/budget/form'
import { BudgetList } from './pages/budget/list'
import { ClassificationList } from './pages/classification/list'
import { CustomerForm, CustomerList } from './pages/customer'
import { AdminDashboard } from './pages/dashboard'
import { SellerForm } from './pages/employee/form'
import { SellerList } from './pages/employee/list'
import { GroupList } from './pages/group/list'
import { InstallmentForm } from './pages/installments/form'
import { InstallmentsList } from './pages/installments/list'
import { AdminLogin } from './pages/login'
import { NfeForm } from './pages/nfe/form'
import { NfeList } from './pages/nfe/list'
import { NfeInputForm } from './pages/nfeInput/form'
import { NfeInputList } from './pages/nfeInput/list'
import { OrderForm } from './pages/Order/form'
import { OrdertList } from './pages/Order/list'
import { PayMethodForm } from './pages/payMethod/form'
import { ProductForm } from './pages/product/form'
import { ProductList } from './pages/product/list'
import { ProviderForm } from './pages/provider/form'
import { ProviderList } from './pages/provider/list'
import { ParameterForm } from './pages/settings/parameterForm'

const rootElement = document.getElementById('root')
render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <AppProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <Panel
              type="sa"
              home={<AdminDashboard />}
              pages={[
                {
                  title: 'Clientes',
                  path: ['/cliente'],
                  icon: 'fas fa-users',
                  element: <CustomerList />,
                },
                {
                  title: 'Fornecedores',
                  path: ['/fornecedor'],
                  icon: 'fas fa-users',
                  element: <ProviderList />,
                },
                {
                  title: 'Estoque',
                  icon: 'fas fa-box',
                  pages: [
                    {
                      title: 'Grupos',
                      path: ['/grupo', '/grupo/cadastro', '/grupo/:id'],
                      element: <GroupList />,
                    },
                    {
                      title: 'Marcas',
                      path: ['/marca', '/marca/cadastro', '/marca/:id'],
                      element: <BrandList />,
                    },
                    {
                      title: 'Produtos',
                      path: ['/produto'],
                      element: <ProductList />,
                    },
                  ],
                },
                {
                  title: 'Orçamentos',
                  path: ['/orcamento'],
                  icon: 'fas fa-file-invoice-dollar',
                  element: <BudgetList />,
                },
                {
                  title: 'Pedidos',
                  path: ['/pedido'],
                  icon: 'fas fa-cash-register',
                  element: <OrdertList />,
                },
                {
                  title: 'Notas',
                  path: ['/nota'],
                  icon: 'fas fa-clipboard',
                  element: <NfeList />,
                },
                {
                  title: 'Notas de Entrada',
                  path: ['/nfe-entrada'],
                  icon: 'fas fa-clipboard',
                  element: <NfeInputList />,
                },
                {
                  title: 'Financeiro',
                  icon: 'fas fa-dollar-sign',
                  pages: [
                    {
                      title: 'Contas',
                      path: ['/conta', '/conta/cadastro', '/conta/:id'],
                      element: <BankAccountList />,
                    },
                    {
                      title: 'Classificação',
                      path: ['/classificacoes', '/classificacoes/cadastro', '/classificacoes/:id'],
                      element: <ClassificationList />,
                    },
                    {
                      title: 'Contas a Pagar',
                      path: ['/conta-pagar'],
                      element: <AccountPayableList />,
                    },
                    {
                      title: 'Contas a Receber',
                      path: ['/receber'],
                      element: <InstallmentsList />,
                    },
                    {
                      title: 'Pagamento de Contas',
                      path: ['/pagamento-contas'],
                      element: <AccountPaymentList />,
                    },
                    {
                      title: 'Registro Boletos',
                      path: ['/registro'],
                      element: <BankRemittanceList />,
                    },
                  ],
                },
                {
                  title: 'Configurações',
                  icon: 'fas fa-cog',
                  pages: [
                    { title: 'Parametros', path: ['/parametros'], element: <ParameterForm /> },
                    {
                      title: 'Usuários',
                      path: ['/usuario'],
                      element: <SellerList />,
                    },
                  ],
                },
              ]}
              routes={[
                {
                  title: '',
                  path: ['/usuario/cadastro', '/usuario/:id'],
                  element: <SellerForm />,
                },
                {
                  title: '',
                  path: ['/cliente/cadastro', '/cliente/:id'],
                  element: <CustomerForm />,
                },
                {
                  title: '',
                  path: ['/fornecedor/cadastro', '/fornecedor/:id'],
                  element: <ProviderForm />,
                },
                {
                  title: '',
                  path: ['/produto/cadastro', '/produto/:id'],
                  element: <ProductForm />,
                },
                {
                  title: '',
                  path: ['/nota/cadastro', '/nota/:id'],
                  element: <NfeForm />,
                },
                {
                  title: '',
                  path: ['/nfe-entrada/cadastro', '/nfe-entrada/:id'],
                  element: <NfeInputForm />,
                },
                {
                  title: '',
                  path: ['/conta-pagar/cadastro', '/conta-pagar/:id'],
                  element: <AccountPayableForm />,
                },
                {
                  title: '',
                  path: ['/receber/cadastro', '/receber/:id'],
                  element: <InstallmentForm />,
                },
                {
                  title: '',
                  path: ['/pagamento-contas/cadastro', '/pagamento-contas/detalhes/:id'],
                  element: <AccountPaymentForm />,
                },
                {
                  title: '',
                  path: ['/orcamento/cadastro', '/orcamento/:id'],
                  element: <BudgetForm />,
                },
                {
                  title: '',
                  path: ['/pedido/cadastro', '/pedido/:id'],
                  element: <OrderForm />,
                },
                {
                  title: '',
                  path: ['/forma-pagamento/cadastro', '/forma-pagamento/:id'],
                  element: <PayMethodForm />,
                },
                {
                  title: '',
                  path: ['/registro/cadastro', '/registro/:id'],
                  element: <BankRemittanceForm />,
                },
              ]}
            />
          }
        />
      </Routes>
    </AppProvider>
  </BrowserRouter>,
  rootElement,
)
