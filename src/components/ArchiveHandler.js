import Swal from 'sweetalert2';
const handleArchive = async (item, isArchiving, archiveFunction, revalidate) => {
	Swal.fire({
            title: `Czy na pewno chcesz ${isArchiving ? 'zarchiwizować informację' : 'cofnąć archiwizację'}?`,
            text: `${isArchiving ? 'Po archiwizacji nie można edytować tej informacji!' : ''}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${isArchiving ? 'Zarchiwizuj!' : 'Cofnij archiwizację'}`,
            cancelButtonText: 'Anuluj'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await archiveFunction(item, isArchiving);
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukces',
                        text: response.message,
                    }).then(() => {
                        revalidate();
                    });
                } else {
                    Swal.fire('Błąd!', response.message, 'error');
                }
            }
        });
};
export default handleArchive;