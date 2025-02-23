import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classes from './AccountActivation.module.css';
import Swal from 'sweetalert2';
export default function AccountActivation() {
    const { token } = useParams();
    const [activationStatus, setActivationStatus] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const activateAccount = async () => {
            try {
                setActivationStatus('loading');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/activate-account/${token}`, {
                    method: 'POST',
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Konto aktywowane pomyślnie',
                        text: 'Teraz możesz zalogować się do swojego konta',
                        confirmButtonText: 'Przejdź do logowania',
                    }).then(() => {
                        navigate('/login');
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Aktywacja nie powiodła się ',
                        text: 'Link aktywacyjny jest nieprawidłowy lub wygasł',
                        confirmButtonText: 'Wróć do strony głównej',
                    }).then(() => {
                        navigate('/');
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Aktywacja nie powiodła się ',
                    text: 'Link aktywacyjny jest nieprawidłowy lub wygasł',
                    confirmButtonText: 'Wróć do strony głównej',
                }).then(() => {
                    navigate('/');
                });
            }
        };

        if (token) {
            activateAccount();
        }
    }, [token]);

  

    return (
        <>
        <div style={{ width: '100%' }} className="p-5 text-center bg-body-tertiary ">
            <div className={classes.containerTop} >
                <div className={classes.containerTitle} >
                    <p className="display-4">Aktywuj swoje konto...</p>
                </div>
                <div className="row">

                </div>
            </div>
            </div>
        </>
    );
}
