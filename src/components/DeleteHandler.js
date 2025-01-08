import Swal from 'sweetalert2';
const handleDelete = async (item, deleteFunction) => {
    Swal.fire({
        title: `Czy na pewno chcesz usunąć ta informację?`,
        text: `Po usunięciu ta informacja nie będzie dostępna!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Usuń`,
        cancelButtonText: 'Anuluj'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await deleteFunction(item);
            if (response.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Sukces',
                    text: response.message,
                }).then(() => {
                    // revalidate();
                });
            } else {
                Swal.fire('Błąd!', response.message, 'error');
            }
        }
    });
};
export default handleDelete;