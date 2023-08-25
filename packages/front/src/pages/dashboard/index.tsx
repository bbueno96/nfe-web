/* eslint-disable react/react-in-jsx-scope */
import { useApp } from '../../App'

export const AdminDashboard = () => {
  const { saOperator } = useApp()

  return (
    <div className="kt-portlet">
      <div className="kt-portlet__head">
        <div className="kt-portlet__head-label">
          <span className="kt-portlet__head-icon">
            <i className="kt-font-brand fas fa-home" />
          </span>
          <h3 className="kt-portlet__head-title">Olá seja bem-vindo, {saOperator?.name}.</h3>
        </div>
      </div>
    </div>
  )
}
