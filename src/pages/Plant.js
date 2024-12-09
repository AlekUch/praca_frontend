import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Plants.module.css';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">{message}</Tooltip>
);

const MySwal = withReactContent(Swal);

function Plants() {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const data = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
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

    const handleShow = () => setShow(true);

    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }
    const plants = data;

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

                formData.append('id', selectedPlant.plantId); // Ustaw identyfikator użytkownika
                submit(formData, { method: 'PUT' });
            } else {
                // Prześlij żądanie POST
                submit(formData, { method: 'POST' });
            }
            handleClose();
        }
    };


    const handleEdit = (plant) => {
        setEditMode(true);
        setSelectedPlant(plant);
        setShow(true);
    };

    const handleClose = () => {
        setEditMode(false);
        setSelectedPlant(null);
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
                <p className="display-4">Rośliny</p>
                <div class="row">
                    <div className="col d-flex justify-content-end">
                        <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nową roślinę</Button>
                    </div>
                </div>
                <div className={classes.container}>
                    <Table responsive >
                        <thead >
                            <tr >
                             <th>#</th>
                                <th>Nazwa</th>
                                <th>Okres zmianowania (lata)</th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            {plants.map(plant => (
                                <tr key={plant.plantId}>
                                    <td>{plant.plantId}</td>
                                    <td>{plant.name}</td>
                                    <td>{plant.rotationPeriod}</td>
                                    
                                    {plant.archival===false ? (
                                        <>
                                            <td>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={renderTooltip('Edytuj')}
                                                >
                                                    <i
                                                        className="bi bi-pencil-square"
                                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                                        onClick={() => handleEdit(plant)}
                                                    />
                                                </OverlayTrigger>


                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={renderTooltip('Archiwizuj')}
                                                >
                                                    <i
                                                        className="bi bi-archive"
                                                        style={{ cursor: 'pointer', color: 'red' }}
                                                        onClick={() => handleArchive(plant, true)}
                                                    />
                                                </OverlayTrigger>
                                            </td>
                                        </>
                                    ) : (
                                        <><td>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={renderTooltip('Cofnij archiwizację')}
                                            >
                                                <i
                                                    className={"bi bi-arrow-counterclockwise"}
                                                    style={{ cursor: 'pointer', color: 'green' }}
                                                    onClick={() => handleArchive(plant, false)}
                                                />
                                            </OverlayTrigger>
                                        </td></>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <Modal show={show} onHide={handleClose} size="md" className={classes.modal} >
                    <Modal.Header closeButton >
                        <Modal.Title className={classes.modalTitle}>
                            {editMode ? 'Edytuj roślinę' : 'Utwórz nową roślinę'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-4" controlId="Name">
                                <Form.Label column sm={3}>
                                    Nazwa rośliny
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nazwa"
                                        required name="Name"
                                        defaultValue={editMode && selectedPlant ? selectedPlant.name : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-4" controlId="RotationPeriod">
                                <Form.Label column sm={3}>
                                    Okres zmianowania (lata)
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="number"
                                        placeholder="Okres"
                                        required name="RotationPeriod"
                                        step="1"
                                        min="0"
                                        max="20"
                                        defaultValue={editMode && selectedPlant ? selectedPlant.rotationPeriod : ''}
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
    const response = await fetch(`https://localhost:44311/agrochem/plants`, {
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
    let url = 'https://localhost:44311/agrochem/plants';

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

export async function archivePlant(plantId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `https://localhost:44311/agrochem/plants/archive/${plantId}?archive=${isArchiving}`;
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