/* eslint-disable react/react-in-jsx-scope */
export const ErrorMessage = ({ error }: { error: string | null }) =>
  error ? (
    <div className="alert alert-outline-danger" role="alert">
      <div className="alert-icon">
        <i className="fas fa-exclamation-triangle" />
      </div>
      <div className="alert-text">{error}</div>
    </div>
  ) : null
