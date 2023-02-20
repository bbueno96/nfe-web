export interface IUpdateClassificationDTO {
  id?: string
  description: string
  code: string
  isGroup: boolean
  parentId?: string
  disabledAt?: Date
  companyId?: string
}
