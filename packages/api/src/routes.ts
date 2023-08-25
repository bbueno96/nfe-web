import { Router } from 'express'
import multer from 'multer'

import { multerOptions } from './config/multer'
import { cancelNfeController } from './useCases/CancelNfe'
import { cartaNfeController } from './useCases/CartaCorrecaoNfe'
import { checkNfeController } from './useCases/CheckNfe'
import { createAccountPayableController } from './useCases/CreateAccountPayable'
import { createAccountPaymentController } from './useCases/CreateAccountPayment'
import { createAdminController } from './useCases/CreateAdmin'
import { createBankAccountController } from './useCases/CreateBankAccount'
import { createBrandController } from './useCases/CreateBrand'
import { createBudgetController } from './useCases/CreateBudget'
import { createClassificationController } from './useCases/CreateClassification'
import { createCustomerController } from './useCases/CreateCustomer'
import { createGroupController } from './useCases/CreateGroup'
import { createInstallmentController } from './useCases/CreateInstallment'
import { createNfeController } from './useCases/CreateNfe'
import { createNfeInputController } from './useCases/CreateNfeInput'
import { createNfeReturnController } from './useCases/CreateNfeReturn'
import { createOrderController } from './useCases/CreateOrder'
import { createProductController } from './useCases/CreateProduct'
import { createProviderController } from './useCases/CreateProvider'
import { createStockProductsController } from './useCases/CreateStockProduct'
import { createTaxSituationController } from './useCases/CreateTaxSituation'
import { emailNfeController } from './useCases/EmailNfe'
import { exportBradesco400Controller } from './useCases/ExportBradesco400'
import { exportSicredi240Controller } from './useCases/ExportSicredi240'
import { getAccountPayableByIdController } from './useCases/GetAccountPayableById'
import { getAdminByIdController } from './useCases/GetAdminById'
import { getBankAccountByIdController } from './useCases/GetBankAccountById'
import { getBoletoPdfByInstallmentController } from './useCases/GetBoletoPdfByInstallment'
import { getBoletoPdfController } from './useCases/GetBoletoPdfByNfe'
import { getBrandByIdController } from './useCases/GetBrandById'
import { getBudgetByIdController } from './useCases/GetBudgetById'
import { getBudgetPdfController } from './useCases/GetBudgetPdf'
import { getClassificationByIdController } from './useCases/GetClassificationById'
import { getCustomerByIdController } from './useCases/GetCustomerById'
import { getGroupByIdController } from './useCases/GetGroupById'
import { getInstallmentByIdController } from './useCases/GetInstallmentById'
import { getNfeByIdController } from './useCases/GetNfeById'
import { getNfePdfController } from './useCases/GetNfePdf'
import { getNfeXmlController } from './useCases/GetNfeXml'
import { getOrderByIdController } from './useCases/GetOrderById'
import { getOrderPdfController } from './useCases/GetOrderPdf'
import { getParameterController } from './useCases/GetParameters'
import { getPayMethodByIdController } from './useCases/GetPayMethodById'
import { getProductByIdController } from './useCases/GetProductById'
import { getProviderByIdController } from './useCases/GetProviderById'
import { getTaxSituationByIdController } from './useCases/GetTaxSituationById'
import { inutilNfeController } from './useCases/InutilNfe'
// import { importReturnController } from './useCases/ImportReturn'
import { listAccountPayableController } from './useCases/ListAccountPayable'
import { listAccountPaymentController } from './useCases/ListAccountPayment'
import { listAdminsController } from './useCases/ListAdmins'
import { listBankAccountController } from './useCases/ListBankAccount'
import { listBankRemittanceController } from './useCases/ListBankRemittance'
import { listBrandController } from './useCases/ListBrand'
import { listBudgetController } from './useCases/ListBudget'
import { listClassificationController } from './useCases/ListClassification'
import { listCustomersController } from './useCases/ListCustomers'
import { listGroupController } from './useCases/ListGroup'
import { listInstallmentController } from './useCases/ListInstallments'
import { listNfeController } from './useCases/ListNfe'
import { listOrderController } from './useCases/ListOrder'
import { listPayMethodController } from './useCases/ListPayMethod'
import { listProductsController } from './useCases/ListProducts'
import { listProductStockPostController } from './useCases/ListProductStockPost'
import { listProductTaxPostController } from './useCases/ListProductTaxPost'
import { listProvidersController } from './useCases/ListProviders'
import { listTaxSituationController } from './useCases/ListTaxSituation'
import { listTaxSituationPostController } from './useCases/ListTaxSituationPost'
import { listXmlNfeController } from './useCases/ListXmlNfe'
import { loginAdminController } from './useCases/LoginAdmin'
import { preDanfeNfeController } from './useCases/PredanfeNfe'
import { readXmlController } from './useCases/ReadXml'
import { removeClassificationController } from './useCases/RemoveClassification'
import { removeCustomerController } from './useCases/RemoveCustomer'
import { removeProviderController } from './useCases/RemoveProvider'
import { sendAuthNfeController } from './useCases/SendAuthNfe'
import { updateAccountPayableController } from './useCases/UpdateAccountPayable'
import { updateAdminController } from './useCases/UpdateAdmin'
import { updateBankAccountController } from './useCases/UpdateBankAccount'
import { updateBrandController } from './useCases/UpdateBrand'
import { updateBudgetController } from './useCases/UpdateBudget'
import { updateCustomerController } from './useCases/UpdateCustomer'
import { updateGroupController } from './useCases/UpdateGroup'
import { updateNfeController } from './useCases/UpdateNfe'
import { updateOrderController } from './useCases/UpdateOrder'
import { updateParameterController } from './useCases/UpdateParameter'
import { updatePayMethodController } from './useCases/UpdatePayMethod'
import { updateProductController } from './useCases/UpdateProduct'
import { updateProductTaxController } from './useCases/UpdateProductTax'
import { updateProviderController } from './useCases/UpdateProvider'
import { updateTaxSituationController } from './useCases/UpdateTaxSituation'
import { validationNfeController } from './useCases/ValidationNfe'
import { authorize } from './utils/express/authorizeMiddleware'
import { runAsync } from './utils/express/runAsync'

const router = Router()

router.post('/login.admin', runAsync(loginAdminController.handle))
router.post('/admin.add', authorize('Admin'), runAsync(createAdminController.handle))
router.post('/admin.update', authorize('Admin'), runAsync(updateAdminController.handle))
router.post('/admin.list', authorize('Admin'), runAsync(listAdminsController.handle))
router.get('/admin.key/:id', authorize('Admin'), runAsync(getAdminByIdController.handle))

router.post('/accountpayable.add', authorize('Admin'), runAsync(createAccountPayableController.handle))
router.post('/accountpayable.list', authorize('Admin'), runAsync(listAccountPayableController.handle))
router.get('/accountpayable.key/:id', authorize('Admin'), runAsync(getAccountPayableByIdController.handle))
router.post('/accountpayable.update/:id', authorize('Admin'), runAsync(updateAccountPayableController.handle))

router.post('/accountpayment.add', authorize('Admin'), runAsync(createAccountPaymentController.handle))
router.post('/accountpayment.list', authorize('Admin'), runAsync(listAccountPaymentController.handle))

router.post('/bankaccount.add', authorize('Admin'), runAsync(createBankAccountController.handle))
router.post('/bankaccount.list', authorize('Admin'), runAsync(listBankAccountController.handle))
router.get('/bankaccount.key/:id', authorize('Admin'), runAsync(getBankAccountByIdController.handle))
router.get('/bankaccount.key/:id', authorize('Admin'), runAsync(getBankAccountByIdController.handle))
router.post('/bankaccount.update/:id', authorize('Admin'), runAsync(updateBankAccountController.handle))

router.post('/bankremittance.list', authorize('Admin'), runAsync(listBankRemittanceController.handle))

router.get('/boletoNfe.report/:id', runAsync(getBoletoPdfController.handle))
router.get('/boletoInstallment.report/:id', runAsync(getBoletoPdfByInstallmentController.handle))

router.post('/budget.add', authorize('Admin'), runAsync(createBudgetController.handle))
router.post('/budget.list', authorize('Admin'), runAsync(listBudgetController.handle))
router.get('/budget.key/:id', authorize('Admin'), runAsync(getBudgetByIdController.handle))
router.post('/budget.update/:id', authorize('Admin'), runAsync(updateBudgetController.handle))
router.get('/budget.report/:id', authorize('Admin'), runAsync(getBudgetPdfController.handle))

router.post('/classification.add', authorize('Admin'), runAsync(createClassificationController.handle))
router.post('/classification.list', authorize('Admin'), runAsync(listClassificationController.handle))
router.get('/classification.key/:id', authorize('Admin'), runAsync(getClassificationByIdController.handle))
router.delete('/classification.delete/:id', authorize('Admin'), runAsync(removeClassificationController.handle))

router.post('/customer.add', authorize('Admin'), runAsync(createCustomerController.handle))
router.post('/customer.list', authorize('Admin'), runAsync(listCustomersController.handle))
router.get('/customer.key/:id', authorize('Admin'), runAsync(getCustomerByIdController.handle))
router.delete('/customer.delete/:id', authorize('Admin'), runAsync(removeCustomerController.handle))
router.post('/customer.update', authorize('Admin'), runAsync(updateCustomerController.handle))

router.post('/brand.add', authorize('Admin'), runAsync(createBrandController.handle))
router.post('/brand.list', authorize('Admin'), runAsync(listBrandController.handle))
router.get('/brand.key/:id', authorize('Admin'), runAsync(getBrandByIdController.handle))
router.post('/brand.update/:id', authorize('Admin'), runAsync(updateBrandController.handle))

router.post('/group.add', authorize('Admin'), runAsync(createGroupController.handle))
router.post('/group.list', authorize('Admin'), runAsync(listGroupController.handle))
router.get('/group.key/:id', authorize('Admin'), runAsync(getGroupByIdController.handle))
router.post('/group.update/:id', authorize('Admin'), runAsync(updateGroupController.handle))

router.post('/installment.remittance.sicredi', authorize('Admin'), runAsync(exportSicredi240Controller.handle))
router.post('/installment.remittance.bradesco', authorize('Admin'), runAsync(exportBradesco400Controller.handle))

router.post('/installment.add', authorize('Admin'), runAsync(createInstallmentController.handle))
router.post('/installment.list', authorize('Admin'), runAsync(listInstallmentController.handle))
router.get('/installment.key/:id', authorize('Admin'), runAsync(getInstallmentByIdController.handle))

// router.post('/import.return', runAsync(importReturnController.handle))

router.post('/nfe.list', authorize('Admin'), runAsync(listNfeController.handle))
router.post('/nfe.listxml', authorize('Admin'), runAsync(listXmlNfeController.handle))
router.post('/nfe.add', authorize('Admin'), runAsync(createNfeController.handle))
router.post('/nfereturn.add', authorize('Admin'), runAsync(createNfeReturnController.handle))
router.post('/nfeinput.add', authorize('Admin'), runAsync(createNfeInputController.handle))
router.get('/nfe.key/:id', authorize('Admin'), runAsync(getNfeByIdController.handle))
router.get('/nfe.report/:id', authorize('Admin'), runAsync(getNfePdfController.handle))
router.get('/nfe.xml/:id', authorize('Admin'), runAsync(getNfeXmlController.handle))
router.get('/nfe.authorize/:id', authorize('Admin'), runAsync(sendAuthNfeController.handle))
router.get('/nfe.predanfe/:id', authorize('Admin'), runAsync(preDanfeNfeController.handle))
router.get('/nfe.check/:id', authorize('Admin'), runAsync(checkNfeController.handle))
router.get('/nfe.validation/:id', authorize('Admin'), runAsync(validationNfeController.handle))
router.get('/nfe.cancel/:id', authorize('Admin'), runAsync(cancelNfeController.handle))
router.get('/nfe.inutil/:id', authorize('Admin'), runAsync(inutilNfeController.handle))
router.get('/nfe.email/:id', authorize('Admin'), runAsync(emailNfeController.handle))
router.post('/nfe.carta/', authorize('Admin'), runAsync(cartaNfeController.handle))
router.post('/nfe.update/:id', authorize('Admin'), runAsync(updateNfeController.handle))

router.post('/order.add', authorize('Admin'), runAsync(createOrderController.handle))
router.post('/order.list', authorize('Admin'), runAsync(listOrderController.handle))
router.get('/order.key/:id', authorize('Admin'), runAsync(getOrderByIdController.handle))
router.post('/order.update/:id', authorize('Admin'), runAsync(updateOrderController.handle))
router.get('/order.report/:id', authorize('Admin'), runAsync(getOrderPdfController.handle))

router.post('/paymethod.list', authorize('Admin'), runAsync(listPayMethodController.handle))
router.get('/paymethod.key/:id', authorize('Admin'), runAsync(getPayMethodByIdController.handle))
router.post('/paymethod.update/:id', authorize('Admin'), runAsync(updatePayMethodController.handle))

router.post('/parameter.get', authorize('Admin'), runAsync(getParameterController.handle))
router.post(
  '/parameter.update',
  authorize('Admin'),
  multer(multerOptions).single('file'),
  runAsync(updateParameterController.handle),
)

router.post('/product.list', authorize('Admin'), runAsync(listProductsController.handle))
router.post('/product.add', authorize('Admin'), runAsync(createProductController.handle))
router.get('/product.key/:id', authorize('Admin'), runAsync(getProductByIdController.handle))
router.post('/product.update/:id', authorize('Admin'), runAsync(updateProductController.handle))
router.post('/producttax.list', authorize('Admin'), runAsync(listProductTaxPostController.handle))
router.post('/productstock.list', authorize('Admin'), runAsync(listProductStockPostController.handle))
router.post('/producttax.add', authorize('Admin'), runAsync(updateProductTaxController.handle))
router.post('/stockproduct.add', authorize('Admin'), runAsync(createStockProductsController.handle))

router.post('/provider.add', authorize('Admin'), runAsync(createProviderController.handle))
router.post('/provider.list', authorize('Admin'), runAsync(listProvidersController.handle))
router.get('/provider.key/:id', authorize('Admin'), runAsync(getProviderByIdController.handle))
router.delete('/provider.delete/:id', authorize('Admin'), runAsync(removeProviderController.handle))
router.post('/provider.update', authorize('Admin'), runAsync(updateProviderController.handle))

router.post('/readXml', authorize('Admin'), multer(multerOptions).single('file'), runAsync(readXmlController.handle))

router.post('/taxsituation.add', authorize('Admin'), runAsync(createTaxSituationController.handle))
router.get('/taxsituation.list', authorize(), runAsync(listTaxSituationController.handle))
router.post('/taxsituation.list', authorize('Admin'), runAsync(listTaxSituationPostController.handle))
router.get('/taxsituation.key/:id', authorize('Admin'), runAsync(getTaxSituationByIdController.handle))
router.post('/taxsituation.update/:id', authorize('Admin'), runAsync(updateTaxSituationController.handle))

export { router }
