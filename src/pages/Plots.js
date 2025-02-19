
import classes from './Plots.module.css';
import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import {  useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import UniversalTable from '../components/Table';
import useActionEffect from '../hooks/useActionEffect';
import archiveHandler from '../utils/ArchiveHandler';


function Plots() {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null); 
    const data = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const [rows, setRows] = useState([]);

    useActionEffect(actionData, revalidate, setShow);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            
            const mappedRows = data.map((item) => ({
                id: item.plotId,
                plotNumber: item.plotNumber,
                area: `${item.area} ha`,
                location: item.address.location,
                district: item.address.district,
                voivodeship: item.address.voivodeship,
                originalData: item,
            }));

            setRows(mappedRows); // Ustawiamy dane w stanie

        }
    }, [data]);
    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }

    const columns = [
        { field: 'plotNumber', headerName: 'Numer działki', flex: 1, minWidth: 200 },
        { field: 'area', headerName: 'Powierzchnia [ha]', flex: 1, minWidth: 200, headerAlign: 'center' },
        { field: 'location', headerName: 'Miejscowość', flex: 1, minWidth: 200, headerAlign: 'center' },
        { field: 'district', headerName: 'Gmina', flex: 1, minWidth: 200, headerAlign: 'center' },
        { field: 'voivodeship', headerName: 'Województwo', flex: 1, minWidth: 200, headerAlign: 'center' },
        
    ];
    
    
    const handleShow = () => setShow(true);
  
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
       
        if (form.checkValidity() === false) {         
            event.stopPropagation();
            setValidated(true);
        } else {
            const formData = new FormData(form);            
            if (editMode) {

                formData.append('id', selectedPlot.plotId); 
                submit(formData, { method: 'PUT' });
            } else {
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
        archiveHandler(plot.plotId, isArchiving, archivePlot, revalidate);
    };
   
        return (
            <>
                <div style={{ width: '100%' }} className="p-3 text-center bg-body-tertiary ">
                    <div className={classes.containerTop} >
                        <div className={classes.containerTitle} >
                            <p className="display-4">Moje działki</p>
                    </div>
                    <div class="row">
                        <div className="col d-flex justify-content-end">
                            <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nową działkę</Button>
                            </div>
                        </div>
                    </div>
                    <div className={classes.container}>
                        <UniversalTable
                            key={JSON.stringify(rows)}
                            columns={columns}
                            rows={rows}
                            onEdit={handleEdit} // Funkcja obsługująca edycję
                            onArchive={handleArchive} // Funkcja obsługująca archiwizację
                            auth="true"
                            archivalField="archival" // Nazwa pola archiwizacji (dynamiczne)
                            title="Działki"
                        />
                     
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/plots?isArchive=true`, {
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
   
    // URL bazowy
    let url = `${process.env.REACT_APP_API_URL}1/agrochem/plots`;

    // Jeśli to metoda PUT, dodaj ID użytkownika do URL
    if (method === 'PUT') {
        const id = formObject.id; // Zakładamy, że ID jest w formularzu
        url = `${url}/${id}`;
    }
   
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formObject),
    });

    const result = await response.json();
    
    if (!response.ok) {     
        return json({ status:'error',message: result.message }, { status: response.status });
    }

    return json({ status:'success',message: result.message }, { status: 200 });
}

export async function archivePlot(plotId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_API_URL}/agrochem/plots/archive/${plotId}?archive=${isArchiving}`;
  
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