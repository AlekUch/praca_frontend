import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Plots.module.css';
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

function Plots() {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null); 
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
    const plots = data;

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
                
                formData.append('id', selectedPlot.plotId); // Ustaw identyfikator użytkownika
                submit(formData, { method: 'PUT' });
            } else {
                // Prześlij żądanie POST
                submit(formData, { method: 'POST' });
            }
            handleClose();
        }
    };

    
    const handleEdit = (plot) => {
        setEditMode(true); 
        setSelectedPlot(plot); 
        setShow(true); 
    };

    const handleClose = () => {
        setEditMode(false);
        setSelectedPlot(null); 
        setShow(false); 
    };

    const handleArchive = (plot, isArchiving) => {
        Swal.fire({
            title: `Czy na pewno chcesz ${isArchiving ? 'zarchiwizować działkę'  : 'cofnąć archiwizację'}?`,
            text: `${isArchiving ? 'Po archiwizacji wszelkie operacje dla tej działki będą niedostępne!' :'Wszystkie operacje dla działki będą dostępne'}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${isArchiving ? 'Zarchiwizuj!' : 'Cofnij archiwizację'}`,
            cancelButtonText: 'Anuluj'
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await archivePlot(plot.plotId, isArchiving);

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
                <p className="display-4">Moje działki</p>
                    <div class="row">
                    <div className="col d-flex justify-content-end">
                    <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nową działkę</Button>
                </div>
                </div>
                <div className={classes.container}>
                    <Table responsive >
                        <thead >
                            <tr >
                                <th>Numer działki</th>
                                <th>Powierzchnia [ha]</th>
                                <th>Miejscowość</th>
                                <th>Gmina</th>
                                <th>Województwo</th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            {plots.map(plot => (
                                <tr   key={plot.plotId}>
                                    <td>{plot.plotNumber}</td>
                                    <td>{plot.area} ha</td>
                                    <td>{plot.address.location} </td>
                                    <td>{plot.address.district}</td>
                                    <td>{plot.address.voivodeship}</td>
                                    {!plot.archival ? (
                                        <>
                                        <td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={renderTooltip('Edytuj')}
                                        >
                                            <i
                                                className="bi bi-pencil-square"
                                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                                onClick={() => handleEdit(plot)}
                                            />
                                        </OverlayTrigger>

             
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip('Archiwizuj')}
                                    >
                                        <i
                                            className="bi bi-archive"
                                            style={{ cursor: 'pointer', color: 'red' }}
                                            onClick={() => handleArchive(plot, true)}
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
                                                        className={ "bi bi-arrow-counterclockwise"}
                                                        style={{ cursor: 'pointer', color:  'green' }}
                                                        onClick={() => handleArchive(plot,false)}
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
                            {editMode ? 'Edytuj działkę' : 'Utwórz nową działkę'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-4" controlId="PlotNumber">
                                <Form.Label column sm={3}>
                                    Numer działki
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numer"
                                        required name="PlotNumber"
                                        defaultValue={editMode && selectedPlot ? selectedPlot.plotNumber : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-4" controlId="Area">
                                <Form.Label column sm={3}>
                                    Powierzchnia [ha]
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="number"
                                        placeholder="Powierzchnia 0000,00"
                                        required name="Area"
                                        step="0.10" 
                                        min="0.10"
                                        max="9999.99"
                                        defaultValue={editMode && selectedPlot ? selectedPlot.area : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-4" controlId="location">
                                <Form.Label column sm={3}>
                                    Miejscowość
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="text"
                                        placeholder="Miejscowść"
                                        required name="location"
                                        defaultValue={editMode && selectedPlot ? selectedPlot.address.location : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="district">
                                <Form.Label column sm={3}>
                                    Gmina
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="text"
                                        placeholder="Gmina"
                                        required name="district"
                                        defaultValue={editMode && selectedPlot ? selectedPlot.address.district : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="voivodeship">
                                <Form.Label column sm={3}>
                                    Województwo
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Województwo"
                                        required name="voivodeship"
                                        defaultValue={editMode && selectedPlot ? selectedPlot.address.voivodeship : ''}
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

export default Plots;
export async function loader() {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://localhost:44311/agrochem/plots`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
        }
    });
    if (!response.ok) {
        const result = await response.json();
        return {isError:true, message:result.message }
    } else {
        return  await response.json();
    }
}

export async function action({request, params}) {
    const token = localStorage.getItem("token");
    const data = await request.formData();
    const formObject = Object.fromEntries(data.entries());

    const method = request.method;
    console.log(request
        .method);
    // URL bazowy
    let url = 'https://localhost:44311/agrochem/plots';

    // Jeśli to metoda PUT, dodaj ID użytkownika do URL
    if (method === 'PUT') {
        const id = formObject.id; // Zakładamy, że ID jest w formularzu
        url = `${url}/${id}`;
    }
    console.log(method);
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formObject),
    });

    const result = await response.json();
    console.log(result.message);
    if (!response.ok) {     
        return json({ status:'error',message: result.message }, { status: response.status });
    }

    return json({ status:'success',message: result.message }, { status: 200 });
}

export async function archivePlot(plotId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `https://localhost:44311/agrochem/plots/archive/${plotId}?archive=${isArchiving}`;
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
        return { status: 'error', message: 'Nie udało się przeprowadzić operacji działki.' };
    }
}
///respons ok, error message -> useActionData
//