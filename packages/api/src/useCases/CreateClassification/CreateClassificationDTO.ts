export interface ICreateClassificationDTO {
  description: string
  code: string
  isGroup: boolean
  parentId?: string
  companyId: string
}
