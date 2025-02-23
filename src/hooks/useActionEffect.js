import { useEffect } from 'react';
import Swal from 'sweetalert2';

const useActionEffect = (actionData, revalidate, setShow) => {
    useEffect(() => {
        if (!actionData) return;

        if (actionData.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Sukces',
                text: actionData.message,
            }).then(() => {
                if (revalidate) revalidate();
                if (setShow) setShow(false);
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Błąd',
                text: actionData.message,
            });
        }
    }, [actionData, revalidate, setShow]);
};

export default useActionEffect;
