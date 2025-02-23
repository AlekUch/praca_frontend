import { useRouteError } from "react-router-dom";
import "./ErrorPage.module.css"; 

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="error-container">
            <h1 className="error-title">Oops! Coś poszło nie tak.</h1>
            <p className="error-text">Nie udało się załadować strony.</p>
            {error && (
                <p className="error-message">
                    <i>{error.statusText || error.message}</i>
                </p>
            )}
            <a href="/" className="error-button">Wróć do strony głównej</a>
        </div>
    );
};

export default ErrorPage;
