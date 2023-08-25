/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDays, addMonths } from 'date-fns'

import { Prisma } from '@prisma/client'

import { Budget } from '../../entities/Budget'
import { Nfe } from '../../entities/Nfe'
import { Order } from '../../entities/Order'
import { getCityCode } from '../../ibge/getCityCode'
import { stateCode } from '../../ibge/state'

export function createInstallments(budget: Budget, companyId, installmentIndex = 1) {
  let installments
  const installmentsList: any[] = []
  let index = installmentIndex
  let portion = 0
  let dueDate = false
  let strDueDate
  if (budget.installments) {
    if (budget.installments.indexOf('/') >= 0) {
      portion = (budget.installments.match(/\//g) || []).length + 1
      dueDate = true
      strDueDate = budget.installments.split('/')
    } else {
      portion = parseInt(budget.installments)
      if (portion === 0 || isNaN(portion)) {
        portion = 1
        dueDate = true
        strDueDate = [0]
      }
    }
    for (index; index <= portion; index++) {
      let auxDueDate = new Date()
      if (dueDate) {
        auxDueDate = new Date(addDays(budget.createdAt, strDueDate[index - 1]))
      } else {
        auxDueDate = new Date(addMonths(budget.createdAt, index))
      }
      installments = {
        numberInstallment: index,
        dueDate: auxDueDate,
        paid: false,
        value: parseFloat('' + budget.total) / portion,
        companyId,
      }
      installmentsList.push(installments)
    }
  }
  return installmentsList
}
export function createInstallmentsOrder(order: Order, companyId, installmentIndex = 1) {
  let installments
  const installmentsList: any[] = []
  let index = installmentIndex
  let portion = 0
  let dueDate = false
  let strDueDate
  if (order.installments) {
    if (order.installments.indexOf('/') >= 0) {
      portion = (order.installments.match(/\//g) || []).length + 1
      dueDate = true
      strDueDate = order.installments.split('/')
    } else {
      portion = parseInt(order.installments)
      if (portion === 0 || isNaN(portion)) {
        portion = 1
        dueDate = true
        strDueDate = [0]
      }
    }
    for (index; index <= portion; index++) {
      let auxDueDate = new Date()
      if (dueDate) {
        auxDueDate = new Date(addDays(order.createdAt, strDueDate[index - 1]))
      } else {
        auxDueDate = new Date(addMonths(order.createdAt, index))
      }
      installments = {
        numberInstallment: index,
        dueDate: auxDueDate,
        paid: false,
        value: parseFloat('' + order.total) / portion,
        companyId,
      }
      installmentsList.push(installments)
    }
  }
  return installmentsList
}
export function createInstallmentsNfe(nfe: Nfe, companyId, parameter, customer, installmentIndex = 1) {
  let installments
  const installmentsList: any[] = []
  let index = installmentIndex
  let portion = 0
  let dueDate = false
  let strDueDate

  if (nfe.installments) {
    if (nfe.installments.indexOf('/') >= 0) {
      portion = (nfe.installments.match(/\//g) || []).length + 1
      dueDate = true
      strDueDate = nfe.installments.split('/')
    } else {
      portion = parseInt(nfe.installments)
      if (portion === 0 || isNaN(portion)) {
        portion = 1
        dueDate = true
        strDueDate = [0]
      }
    }

    for (index; index <= portion; index++) {
      let auxDueDate = new Date()
      if (dueDate) {
        auxDueDate = new Date(addDays(nfe.data, strDueDate[index - 1]))
      } else {
        auxDueDate = new Date(addMonths(nfe.data, index))
      }
      installments = {
        numberInstallment: index,
        dueDate: auxDueDate,
        paid: false,
        value: new Prisma.Decimal(parseFloat('' + nfe.totalNota) / portion),
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
        installments: nfe.installments,
        paymentMean: nfe.paymentMean,
      }
      installmentsList.push(installments)
    }
  }
  return installmentsList
}
export function createInstallmentsSingle(subAccounts, numeroDoc, companyId, parameter, customer, installmentIndex = 0) {
  let installments
  const installmentsList: any[] = []
  let index = installmentIndex
  for (index = 0; index < subAccounts.length; index++) {
    installments = {
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
    }
    installmentsList.push(installments)
  }

  return installmentsList
}
