import { useState, useEffect } from 'react';

const ErrorDisplay = ({ errors }) => {
  const [visibleErrors, setVisibleErrors] = useState([]);

  useEffect(() => {
  
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setVisibleErrors([]);
        errors.forEach((error, index) => {
          setTimeout(() => {
            setVisibleErrors(prev => [...prev, error]);
          }, index * 200);
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <>
      <div className="error-header">
        <div className="error-icon">⚠️</div>
        <h3>Errors</h3>
        <div className="error-icon">⚠️</div>
      </div>
      <div className="error-display">


        <table className="error-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {visibleErrors.map((error, index) => (
              <tr
                key={index}
                className="error-row-item"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <td className="error-row-cell">{error.row}</td>
                <td className="error-message-cell">{error.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>

  );
};

export default ErrorDisplay;  