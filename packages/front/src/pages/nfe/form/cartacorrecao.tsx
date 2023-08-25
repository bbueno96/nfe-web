import React, { useState } from 'react'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import { Field } from '../../../components/form/field'
import { TextAreaInput } from '../../../components/form/textarea-input'

export const CartaForm = ({ entity }) => {
  const [carta, setCarta] = useState([])
  const { modal, saToken } = useApp()
  function EnvCarta() {
    modal?.confirm(
      'Deseja enviar Carta de Correção?',
      confirmed =>
        confirmed &&
        axios
          .post(
            `nfe.carta`,
            { nota: entity, cartaCorrecao: carta },
            { headers: { Authorization: `Bearer ${saToken}` } },
          )
          .then(cartaC => {
            if (cartaC.data) modal?.alert('carta de correção Vinculada a NFe')
            else modal?.alert('Não foi possível vinculada a carta de correção a NFe')
          })
          .catch(err => modal?.alert(err.message))
          .finally(),
    )
  }
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída.">
            <TextAreaInput
              refEl={undefined}
              value={entity.cartaCorrecao}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={carta => setCarta(carta)}
              rows={5}
              readOnly={false}
              maxLenght={150}
            ></TextAreaInput>
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg" />

        <Button
          type="button"
          icon="fas fa-envelope-open-text"
          customClassName="btn-primary margin-right-10 margin-bottom-10 widthButton"
          title="Enviar Carta"
          disabled={entity.statuscartaCorrecao === 'Enviado'}
          onClick={() => EnvCarta()}
        />
      </div>
    </>
  )
}
