class ProviderProducts {
  id?: string
  productId: string
  productIdProvider: string
  providerId: string
  companyId: string

  private constructor({ productId, productIdProvider, providerId, companyId }: ProviderProducts) {
    return Object.assign(this, {
      productId,
      productIdProvider,
      providerId,
      companyId,
    })
  }

  static create({ productId, productIdProvider, providerId, companyId }: ProviderProducts) {
    const providerProducts = new ProviderProducts({
      productId,
      productIdProvider,
      providerId,
      companyId,
    })

    return providerProducts
  }
}

export { ProviderProducts }
