interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
