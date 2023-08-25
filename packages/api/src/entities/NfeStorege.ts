import { v4 as uuidv4 } from 'uuid'

class NfeStorege {
  id?: string
  nome: string
  conteudo?: Buffer | null
  companyId?: string | null

  constructor(props: Omit<NfeStorege, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.nome = props.nome
    this.conteudo = props.conteudo
    this.companyId = props.companyId
  }
}

export { NfeStorege }
