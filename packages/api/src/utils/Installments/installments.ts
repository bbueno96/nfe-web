import { Prisma } from '@prisma/client'

import { Budget } from '../../entities/Budget'
import { Nfe } from '../../entities/Nfe'
import { PayMethod } from '../../entities/PayMethod'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'

export function createInstallments(
  paymentMethod: PayMethod,
  budget: Budget,
  companyId,
  installmentIndex = 1,
  contractDate = true,
) {
  let installments = []
  let month = contractDate ? budget.createdAt.getMonth() + 1 : new Date().getMonth() + 1
  let index = installmentIndex
  for (index; index <= paymentMethod.numberInstallments; index++) {
    installments = [
      ...installments,
      {
        numberInstallment: index,
        dueDate: new Date(budget.createdAt.getFullYear(), month, paymentMethod.dueDay),
        paid: false,
        value: parseFloat('' + budget.total) / paymentMethod.numberInstallments,
        fine: paymentMethod.fine,
        interest: paymentMethod.interest,
        paymentMethodId: paymentMethod.id,
        companyId,
      },
    ]
    month++
  }

  return installments
}

export function createInstallmentsNfe(
  paymentMethod: PayMethod,
  nfe: Nfe,
  companyId,
  parameter,
  customer,
  installmentIndex = 1,
  contractDate = true,
) {
  let installments = []
  let month = contractDate ? nfe.data.getMonth() + 1 : new Date().getMonth() + 1
  let index = installmentIndex
  for (index; index <= paymentMethod.numberInstallments; index++) {
    installments = [
      ...installments,
      {
        numberInstallment: index,
        dueDate: new Date(nfe.data.getFullYear(), month, paymentMethod.dueDay),
        paid: false,
        value: new Prisma.Decimal(parseFloat('' + nfe.totalNota) / paymentMethod.numberInstallments),
        fine: new Prisma.Decimal(paymentMethod.fine),
        interest: new Prisma.Decimal(paymentMethod.interest),
        paymentMethodId: paymentMethod.id,
        companyId,
        numeroDoc: '' + nfe.numeroNota,
        nfeId: nfe.id,
        customerId: parameter.getApoio ? null : nfe.cliente,
        customerApoioId: parameter.getApoio ? nfe.cliente : null,
        customerApoioName: customer?.name,
        stateInscriptionApoio: customer?.stateInscription,
        emailApoio: customer?.emailApoio,
        phoneApoio: customer?.mobilePhone,
        addressApoio: customer?.address,
        addressNumberApoio: customer?.addressNumber,
        complementApoio: customer?.complement,
        provinceApoio: customer?.province,
        postalCodeApoio: customer?.postalCode,
        cityIdApoio: parameter.getApoio ? getCityCode(customer.cityId, stateCode[customer.state]) : null,
        stateApoio: customer?.state,
        cpfCnpjApoio: customer?.cpfCnpj,
      },
    ]
    month++
  }

  return installments
}
export function createInstallmentsSingle(subAccounts, numeroDoc, companyId, parameter, customer, installmentIndex = 0) {
  let installments = []
  let index = installmentIndex
  for (index = 0; index < subAccounts.length; index++) {
    installments = [
      ...installments,
      {
        numberInstallment: subAccounts[index]?.numberInstallment || 1,
        dueDate: subAccounts[index].dueDate,
        paid: false,
        value: subAccounts[index].value,

        companyId,
        numeroDoc,
        customerId: parameter.getApoio ? null : customer.cliente,
        customerApoioId: parameter.getApoio ? customer.customerApoioId : null,
        customerApoioName: customer?.name,
        stateInscriptionApoio: customer?.stateInscription,
        emailApoio: customer?.emailApoio,
        phoneApoio: customer?.mobilePhone,
        addressApoio: customer?.address,
        addressNumberApoio: customer?.addressNumber,
        complementApoio: customer?.complement,
        provinceApoio: customer?.province,
        postalCodeApoio: customer?.postalCode,
        cityIdApoio: parameter.getApoio ? getCityCode(customer.cityId, stateCode[customer.state]) : null,
        stateApoio: customer?.state,
        cpfCnpjApoio: customer?.cpfCnpj,
      },
    ]
  }

  return installments
}
