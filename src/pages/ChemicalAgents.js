import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './ChemicalAgents.module.css';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import UniversalTable from '../components/Table';
import { Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";


const MySwal = withReactContent(Swal);

function Plants() {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedChemAgent, setSelectedChemAgent] = useState(null);
    const data = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const navigate = useNavigate();
    const [expandedRows, setExpandedRows] = useState({});
    const chemAgents = data;
    useEffect(() => {
        if (!actionData)
            return;
        if (actionData.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Sukces',
                text: actionData.message,
            }).then(() => {
                revalidate();
                setShow(false);
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Błąd',
                text: actionData.message,
            });
        }
    }, [actionData]
    );

    const columns = [
        { field: 'name', headerName: 'Nazwa', minWidth: 180, headerAlign: 'center' },
        { field: 'type', headerName: 'Typ', minWidth: 160, headerAlign: 'center' },
        { field: 'description', headerName: 'Opis', minWidth: 500, headerAlign: 'center' },
        { field: "details", headerName: "Szczegóły", minWidth: 100, headerAlign: 'center' },

    ];

    const rows = chemAgents.map((item) => ({
        id: item.chemAgentId,
        name: item.name,
        type: item.type,
        description: item.description,
        originalData: item,
        details: (
            <IconButton
                onClick={() => navigate(`/chemicalagents/${item.chemAgentId}`)} // Funkcja do kliknięcia
                color="primary"
            >
                <Visibility />
            </IconButton>)
    }));
   
    const handleShow = () => setShow(true);

    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }
  

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        // Przeprowadzenie walidacji formularza
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            const formData = new FormData(form);
            console.log(editMode);

            if (editMode) {
                // Prześlij żądanie PUT

                formData.append('id', selectedChemAgent.chemAgentId); // Ustaw identyfikator użytkownika
                submit(formData, { method: 'PUT' });
            } else {
                // Prześlij żądanie POST
                submit(formData, { method: 'POST' });
            }
            handleClose();
        }
    };


    const handleEdit = (chemAgent) => {
        setEditMode(true);
        setSelectedChemAgent(chemAgent);
        setShow(true);
    };

    const handleClose = () => {
        setEditMode(false);
        setSelectedChemAgent(null);
        setShow(false);
    };

    const handleArchive = (plant, isArchiving) => {
        Swal.fire({
            title: `Czy na pewno chcesz ${isArchiving ? 'zarchiwizować środek' : 'cofnąć archiwizację'}?`,
            text: `${isArchiving ? 'Po archiwizacji ten środek będzie niedostępny!' : ''}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${isArchiving ? 'Zarchiwizuj!' : 'Cofnij archiwizację'}`,
            cancelButtonText: 'Anuluj'
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await archiveChemAgnet(plant.chemAgentId, isArchiving);

                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukces',
                        text: response.message,
                    }).then(() => {
                        window.location.reload(true);
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
                <p className="display-4">Środki chemiczne</p>
                <div class="row">
                    <div className="col d-flex justify-content-end">
                        <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nowy środek chemiczny</Button>
                    </div>
                </div>
                <div className={classes.container}>
                    <UniversalTable columns={columns}
                        rows={rows}
                        onEdit={handleEdit} // Funkcja obsługująca edycję
                        onArchive={handleArchive} // Funkcja obsługująca archiwizację
                        archivalField="archival" // Nazwa pola archiwizacji (dynamiczne)
                    />
                </div>
                <Modal show={show} onHide={handleClose} size="md" className={classes.modal} >
                    <Modal.Header closeButton >
                        <Modal.Title className={classes.modalTitle}>
                            {editMode ? 'Edytuj środek' : 'Utwórz nowy środek chemiczny'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-4" controlId="Name">
                                <Form.Label column sm={3}>
                                    Nazwa środka
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nazwa"
                                        required name="Name"
                                        defaultValue={editMode && selectedChemAgent ? selectedChemAgent.name : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Type">
                                <Form.Label column sm={3}>
                                    Typ środka
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Typ"
                                        required name="Type"
                                        defaultValue={editMode && selectedChemAgent ? selectedChemAgent.type : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Description">
                                <Form.Label column sm={3}>
                                    Opis środka
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        as="textarea"
                                        maxLength={2000} 
                                        rows={5}
                                        placeholder="Opis (max 2 000 znaków)"
                                        required name="Description"
                                        defaultValue={editMode && selectedChemAgent ? selectedChemAgent.description : ''}
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

export default Plants;
export async function loader() {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://localhost:44311/agrochem/chemicalagents`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
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
    console.log(request
        .method);
    // URL bazowy
    let url = 'https://localhost:44311/agrochem/chemicalagents';

    // Jeśli to metoda PUT, dodaj ID użytkownika do URL
    if (method === 'PUT') {
        const id = formObject.id; // Zakładamy, że ID jest w formularzu
        url = `${url}/${id}`;
    }
    console.log(method);
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
        return json({ status: 'error', message: error.message }); // Wyświetl błąd

    }
}

export async function archiveChemAgnet(chemAgenId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `https://localhost:44311/agrochem/chemicalagents/archive/${chemAgenId}?archive=${isArchiving}`;
    console.log(isArchiving);
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
///respons ok, error message -> useActionData
//