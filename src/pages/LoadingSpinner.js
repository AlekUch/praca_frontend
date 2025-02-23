import "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p className="loading-text">£adowanie...</p>
        </div>
    );
};

export default LoadingSpinner;
