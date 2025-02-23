
import classes from './Users.module.css';
import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import UniversalTable from '../components/Table';
import useActionEffect from '../hooks/useActionEffect';
import { isAdmin } from '../utils/authUtil';

function Users() {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const data = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const [rows, setRows] = useState([]);

    useActionEffect(actionData, revalidate, setShow);

    useEffect(() => {
        if (data && Array.isArray(data)) {

            const mappedRows = data.map((item) => ({
                id: item.userId,
                email: item.email,
                firstName: item.firstName,
                lastName: item.lastName,
                emailConfirmed: item.emailConfirmed ? 'Tak' : 'Nie',
                originalData: item,
            }));

            setRows(mappedRows); 

        }
    }, [data]);

    const columns = [
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 150, headerAlign: 'center' },
        { field: 'firstName', headerName: 'Imię', flex: 1, minWidth: 150, headerAlign: 'center' },
        { field: 'lastName', headerName: 'Nazwisko', flex: 1, minWidth: 150, headerAlign: 'center' },
        { field: 'emailConfirmed', headerName: 'Aktywny', flex: 1, minWidth: 150, headerAlign: 'center' },
    ];
    const handleShow = () => setShow(true);

    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            const formData = new FormData(form);
                formData.append('id', selectedUser.userId); 
                submit(formData, { method: 'PUT' });           
                handleClose();
        }
    };


    const handleEdit = (user) => {
        setSelectedUser(user);
        setShow(true);
    };

    const handleClose = () => {
        setSelectedUser(null);
        setShow(false);
    };

    const handleArchive = (plant, isArchiving) => {
        Swal.fire({
            title: `Czy na pewno chcesz ${isArchiving ? 'zarchiwizować roślinę' : 'cofnąć archiwizację'}?`,
            text: `${isArchiving ? 'Po archiwizacji ta roślina będzie niedostępna!' : ''}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${isArchiving ? 'Zarchiwizuj!' : 'Cofnij archiwizację'}`,
            cancelButtonText: 'Anuluj'
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await archivePlant(plant.plantId, isArchiving);

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

    return (
        <>
            <div style={{ width: '100%' }} className="p-5 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                    <div className={classes.containerTitle} >

                        <p className="display-4">Użytkownicy</p>
                    </div>
                   
                </div>
                <div className={classes.container}>
                    <UniversalTable
                        key={JSON.stringify(rows)}
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit} 
                        onArchive={handleArchive} 
                        auth={isAdmin()}
                        archivalField="archival"
                    />
                </div>
                <Modal show={show} onHide={handleClose} size="md" className={classes.modal} >
                    <Modal.Header closeButton >
                        <Modal.Title className={classes.modalTitle}>
                            { 'Edytuj użytkownika' }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={'PUT'} onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-4" controlId="FirstName">
                                <Form.Label column sm={3}>
                                    Imię
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        required name="FirstName"
                                        defaultValue={selectedUser ? selectedUser.firstName :''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-4" controlId="LastName">
                                <Form.Label column sm={3}>
                                    Nazwisko
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        required name="LastName"
                                        defaultValue={selectedUser ? selectedUser.lastName : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Email">
                                <Form.Label column sm={3}>
                                   Email
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="email"
                                        required name="Email"
                                        defaultValue={selectedUser ? selectedUser.email : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" >
                                <Button className={classes.savePlotButton} type="submit">ZAPISZ</Button>
                                <Button variant="secondary" onClick={handleClose} className={classes.modalFooterButton}>
                                    Anuluj
                                </Button>
                            </Form.Group>
                        </Form>

                    </Modal.Body>

                </Modal>
            </div>
        </>
    )


}

export default Users;
export async function loader() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  
        }
    });
    if (!response.ok) {
        const result = await response.json();
        return { isError: true, message: result.message }
    } else {
        return await response.json();
    }
}

export async function action({ request, params }) {
    const token = localStorage.getItem("token");
    const data = await request.formData();
    const formObject = Object.fromEntries(data.entries());
    const method = request.method;

    let url = `${process.env.REACT_APP_API_URL}/agrochem/user`;

    if (method === 'PUT') {
        const id = formObject.id; 
        url = `${url}/${id}`;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formObject),
        });

        if (!response.ok) {
            const result = await response.json();
            return json({ status: 'error', message: result.message }, { status: response.status });
        } else {
            const result = await response.json();
            return json({ status: 'success', message: result.message }, { status: 200 });
        }
    } catch (error) {
        return json({ status: 'error', message: error.message }); 

    }
}

export async function archivePlant(plantId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_API_URL}/plants/archive/${plantId}?archive=${isArchiving}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            return { status: 'success', message: result.message };
        } else {
            const errorData = await response.json();
            return { status: 'error', message: errorData.message || 'Wystąpił błąd podczas archiwizacji.' };
        }
    } catch (error) {
        return { status: 'error', message: 'Nie udało się przeprowadzić operacji dla tej rośliny.' };
    }
}