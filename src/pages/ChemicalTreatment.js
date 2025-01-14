import classes from './ChemicalTreatment.module.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Button,  Modal} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import {  useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import UniversalTable from '../components/Table';



const ChemicalTreatment = () => {
    const [show, setShow] = useState(false);
    const actionData = useActionData();
    const { chemTreat, cultivations, isError, message } = useLoaderData();
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);   
    const [chemaAgents, setChemAgents] = useState([]);
    const [selectedChemTreatment, setSelectedChemTreatment] = useState(null);
    const [selectedCultivation, setSelectedCultivation] = useState(null);
    const [selectedChemAgent, setSelectedChemAgent] = useState(null);
    const [selectedChemUse, setSelectedChemUse] = useState(null);
    const [dose, setDose] = useState(null);
    const submit = useSubmit();
    const [plant, setPlant] = useState(null);
    const [minDose, setMinDose] = useState(null);
    const [maxDose, setMaxDose] = useState(null);
    const { revalidate } = useRevalidator();
    const [rows, setRows] = useState([]);
  

    useEffect(() => {
        if (chemTreat && Array.isArray(chemTreat)) {         
            const mappedRows = chemTreat.map((item) => ({
                id: item.chemTreatId,
                date: new Date(item.date).toLocaleDateString("pl-PL"),
                plotNumber: item.plotNumber,
                plantName: item.plantName,
                area: `${item.area} ha`,
                chemAgentName: item.chemAgentName,
                dose: item.dose,
                reason: item.reason,
                originalData: item,
            }));
            setRows(mappedRows); // Ustawiamy dane w stanie
        }
    }, [chemTreat]);

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
   

    useEffect(() => {
        if (selectedCultivation) {
            const fetchChemAgent = async () => {
                try {
                    const token = localStorage.getItem("token");
                    let plantId = selectedCultivation.plantId ? selectedCultivation.plantId: plant ;
                    const response = await fetch(`https://localhost:44311/agrochem/chemicaluse/plant/${plantId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
                        }
                    });
                    const data = await response.json();
                    console.log("chemag", data);
                    setChemAgents(data);
                } catch (error) {
                    console.error("Error fetching third list:", error);
                }
            };
            fetchChemAgent();
        }
        else {
            setChemAgents([]);
        }     
    }, [selectedCultivation]);

    const columns = [
        { field: 'date', headerName: 'Data', flex: 1, minWidth: 150, headerAlign: 'center' },
        { field: 'plotNumber', headerName: 'Numer działki', flex: 1, minWidth: 150, headerAlign: 'center'  },
        { field: 'plantName', headerName: 'Uprawiana roślina', flex: 1, minWidth: 200, headerAlign: 'center' },
        { field: 'area', headerName: 'Powierzchnia [ha]', flex: 1, minWidth: 200, headerAlign: 'center' },
        { field: 'chemAgentName', headerName: 'Środek chemiczny', flex: 1, minWidth: 150, headerAlign: 'center' },
        { field: 'dose', headerName: 'Dawka [l]', flex: 1, minWidth: 150, headerAlign: 'center' },
        { field: 'reason', headerName: 'Przyczyna', flex: 1, minWidth: 250, headerAlign: 'center' },


    ];
    const handleShow = () => setShow(true);

    const handleClose = () => {
        setEditMode(false);
        setSelectedChemTreatment(null);
        setSelectedCultivation(null);
        setSelectedChemAgent(null);
        setPlant(null);
        setMinDose("");
        setMaxDose("");  
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {  
            const formData = new FormData(form);
            formData.set('ChemAgentId', selectedChemAgent.chemAgentId ? selectedChemAgent.chemAgentId : selectedChemAgent);

            const formObject = Object.fromEntries(formData.entries());
            console.log("form", formObject);
            
            //if (editMode) {
               
            //    submit({ ...dataToSend, id: selectedChemTreatment.chemTreatId }, { method: 'PUT' });
            //} else {  
                
            //    submit(dataToSend, { method: 'POST' });
            //}

            handleClose();
        }

    };
    const handleEdit = (chemTreat) => {
        setEditMode(true);
        setSelectedChemTreatment(chemTreat);
        setSelectedCultivation(chemTreat.cultivationId);
        setSelectedChemAgent(chemTreat.chemAgentId);
        setSelectedChemUse(chemTreat.chemUseId);
        setPlant(chemTreat.plantId);
        setDose(chemTreat.dose);      
        setMinDose(chemTreat.minDose);
        setMaxDose(chemTreat.maxDose);       
        setShow(true);
    };

    const handelSelectCultivation = (event) => {
        const value = event.target.value;
        setSelectedChemAgent(null);
        setSelectedChemUse(null);
        const selected = cultivations.find(
            (cultivation) => cultivation.cultivationId === parseInt(value)
        );
        setSelectedCultivation(selected); // Zapisz cały obiekt produktu 
    };

    const handleSelectChemAgent = (event) => {
        const value = event.target.value;
        const selected = chemaAgents.find(
            (chemAgent) => chemAgent.chemUseId === parseInt(value)
        );
        setSelectedChemAgent(selected); 
    }

    return (
        <>
            <div style={{ width: '100%' }} className="p-3 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                <div className={classes.containerTitle} >

                        <p className="display-4 p-3" ><b>Zabiegi chemiczne</b></p>
                    </div>
                    <div class="row" style={{ bottom: "0" }}>
                        <div className="col d-flex justify-content-end" >
                        <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nowy zabieg</Button>
                    </div>
                    </div>
                </div>
                <div className={classes.container}>

                    <UniversalTable
                        key={JSON.stringify(rows)}
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit} // Funkcja obsługująca edycję                       
                        archivalField="brak" // Nazwa pola archiwizacji (dynamiczne)
                        title="Zabiegi chemiczne"
                    />
                </div>
                <Modal show={show} onHide={handleClose} size="md" className={classes.modal} >
                    <Modal.Header closeButton >
                        <Modal.Title className={classes.modalTitle}>
                            {editMode ? 'Edytuj zabieg' : 'Utwórz nowy zabieg'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit} encType="multipart/form-data">
                            <Form.Group as={Row} className="mb-4" controlId="CultivationId">
                                <Form.Label column sm={4}>
                                    Uprawa
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control as="select"                                       
                                        value={
                                            selectedCultivation && selectedCultivation.cultivationId
                                                ? selectedCultivation.cultivationId // Jeśli edytujesz i masz wybrany element
                                                : selectedCultivation
                                                    ? selectedCultivation // Jeśli tylko wybrany element
                                                    : '' // Jeśli nic
                                        }
                                        onChange={handelSelectCultivation}                          
                                        required
                                        name="CultivationId"
                                        isInvalid={validated && !selectedCultivation}>
                                        <option value="" >Wybierz z listy...</option>
                                        {cultivations.map(cultivation => (
                                            <option key={cultivation.cultivationId} value={cultivation.cultivationId}>{cultivation.plotNumber} - {cultivation.plantName}</option>

                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>
                            {selectedCultivation && (
                                <Form.Group as={Row} className="mb-4" controlId="Area">
                                    <Form.Label column sm={4}>Powierzchnia uprawy</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            value={
                                                editMode && selectedChemTreatment
                                                    ? `${Number(selectedChemTreatment.area)} ha`
                                                    :  `${Number(selectedCultivation.area)} ha`                                                                                                             
                                                    }

                                            readOnly
                                            name="Area"
                                        />
                                    </Col>
                                </Form.Group>

                            )}

                            <Form.Group as={Row} className="mb-4" controlId="ChemAgentId">
                                <Form.Label column sm={4}>
                                    Środek chemiczny
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control as="select"
                                        value={
                                            selectedChemAgent && selectedChemAgent.chemUseId
                                                ? selectedChemAgent.chemUseId // Jeśli edytujesz i masz wybrany element
                                                : selectedChemUse
                                                    ? selectedChemUse // Jeśli tylko wybrany element
                                                    : '' // Jeśli nic
                                        }
                                        onChange={handleSelectChemAgent}
                                        required
                                        name="ChemAgentId"
                                        isInvalid={validated && !selectedCultivation}>
                                        <option value="" >Wybierz z listy...</option>
                                        {chemaAgents.map(chemAgent => (
                                            <option key={chemAgent.chemUseId} value={chemAgent.chemUseId}>{chemAgent.chemAgentName} </option>

                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group >
                            {selectedChemAgent && (
                                <Form.Group as={Row} className="mb-4" controlId="Dose">
                                    <Form.Label column sm={4}>Dawka środka ({`${selectedChemAgent.minDose}l -  ${maxDose}l`} )</Form.Label>
                                    <Col sm={8}>
                                    <Form.Control
                                        type="number"
                                        value={dose}
                                        onChange={(e) => setDose(e.target.value)}
                                            min={selectedChemAgent.minDose}
                                            max={maxDose}
                                            step="0.10"
                                            isInvalid={validated && (dose > maxDose || dose < minDose)}
                                            required
                                        name="Dose"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Dawka środka musi być między minimalną a maksymalną ilośćią dla tego środka.
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            )}

                            <Form.Group as={Row} className="mb-4" controlId="date">
                                <Form.Label column sm={4}>Data zabiegu</Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="date"
                                        defaultValue={editMode && selectedChemTreatment ? selectedChemTreatment.date : ""}                                       
                                        required
                                       name="date"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Reason">
                                <Form.Label column sm={4}>
                                    Przyczyna
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        as="textarea"
                                        maxLength={2000}
                                        rows={5}
                                        defaultValue={editMode && selectedChemTreatment ? selectedChemTreatment.reason :""}                   
                                        required name="reasons"
                                    // defaultValue={editMode && selectedPlant ? selectedPlant.name : ''}
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
};

export default ChemicalTreatment;
export async function loader() {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    try {
        const [treatmentsResponse, cultivationsResponse] = await Promise.all([
            fetch(`https://localhost:44311/agrochem/chemicaltreatment`, { method: 'GET', headers }),
            fetch(`https://localhost:44311/agrochem/cultivations`, { method: 'GET', headers }),
           
        ]);
        if (!treatmentsResponse.ok || !cultivationsResponse.ok) {
            return {
                isError: true,
                message: "Failed to fetch data",
            };
        }

        // Parsowanie danych
        const [chemTreat, cultivations] = await Promise.all([
            treatmentsResponse.json(),
            cultivationsResponse.json()
        ]);
       
        return { chemTreat, cultivations, isError: false, message: "" };

    } catch (error) {
        console.error("Loader error:", error);
        return { isError: true, message: "An unexpected error occurred" };
    }
    
   
}
export async function action({ request, params }) {
    const token = localStorage.getItem("token");
    const data = await request.formData();
    const formObject = Object.fromEntries(data.entries());
    console.log(formObject);
    const method = request.method;
    console.log(request
        .method);
    // URL bazowy
    let url = 'https://localhost:44311/agrochem/chemicaltreatment';

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