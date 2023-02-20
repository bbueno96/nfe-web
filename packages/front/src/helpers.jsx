export const getCustomers = () =>
  fetch(`https://apoiogenetica.sistemaexpert.com.br/api/customer.list.public`).then(r => r.json())
