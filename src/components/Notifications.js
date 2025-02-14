import Swal from 'sweetalert2';
import React, { useEffect } from 'react';

const Notifications = () => {
    useEffect(() => {
        Swal.fire({
            title: 'Powiadomienia!',
            text: "Masz nieodczytane powiadomienia",
            icon: 'info',
            showCancelButton: true,           
            cancelButtonText: "Sprawdź później",
            confirmButtonText: "Przejdź do powiadomień",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/notifications"; 
            }
        });
    }, []); 

    return (
        <div>

        </div>
    );
};

export default Notifications;