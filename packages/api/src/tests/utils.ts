import jwt from 'jsonwebtoken'

export function getAuthToken(data?: Partial<TokenOperator>) {
  const payload: TokenOperator = {
    id: '12345',
    name: 'Operator',
    roles: [],
    companyId: '50a6fe34-dbb3-496e-b5f3-ae9ab4ee86a7',
    ...data,
  }

  return jwt.sign(payload, process.env.APP_SECRET!, { expiresIn: '10y' })
}
