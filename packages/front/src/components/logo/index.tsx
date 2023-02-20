import React from 'react'

import ExpertLogo from '../../assets/img/apoio.png'

export const Logo = () => {
  return <img alt={process.env.REACT_APP_CUSTOMER_NAME} src={ExpertLogo} />
}
