import classes from './ChemicalTreatment.module.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Button,  Modal} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {  useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import UniversalTable from '../components/Table';
import useActionEffect from '../hooks/useActionEffect';
import deleteHandler from '../components/DeleteHandler';

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
    const [dose, setDose] = useState("");
    const submit = useSubmit();
    const [area, setArea] = useState("");  
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

    useActionEffect(actionData, revalidate, setShow);
   
    useEffect(() => {
        if (selectedCultivation) {
            const fetchChemAgent = async () => {
                try {
                    const token = localStorage.getItem("token");
                    let plantId = selectedCultivation.plantId ? selectedCultivation.plantId : selectedChemTreatment.plantId;
                    const response = await fetch(`https://localhost:44311/agrochem/chemicaluse/plant/${plantId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,  
                        }
                    });
                    const data = await response.json();
                    
                    setChemAgents(data);
                } catch (error) {
                   
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
        setDose("");
        setArea("");
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
            if (editMode) {
                formData.append("id", selectedChemTreatment.chemTreatId);
                submit( formData, { method: 'PUT' });
            } else {  
                
                submit(formData, { method: 'POST' });
            }
            handleClose();
        }
    };
    const handleEdit = (chemTreat) => {
        setEditMode(true);
        setSelectedChemTreatment(chemTreat);
        setSelectedCultivation(chemTreat.cultivationId);
        setSelectedChemAgent(chemTreat.chemAgentId);
        setSelectedChemUse(chemTreat.chemUseId);
        setDose(chemTreat.dose);     
        setArea(chemTreat.area);
        setShow(true);
    };

    const handelSelectCultivation = (event) => {
        const value = event.target.value;
        setSelectedChemAgent(null);
        setSelectedChemUse(null);
        const selected = cultivations.find(
            (cultivation) => cultivation.cultivationId === parseInt(value)
        );
        setSelectedCultivation(selected); 
    };

    const handleSelectChemAgent = (event) => {
        const value = event.target.value;
        const selected = chemaAgents.find(
            (chemAgent) => chemAgent.chemUseId === parseInt(value)
        );
        setSelectedChemAgent(selected);
    };

    const handleDelete = (chemTreat) => {
        deleteHandler(chemTreat.chemTreatId, deleteChemicalTreatment,revalidate);
    }

    return (
        <>
            <div style={{ width: '100%' }} className="p-3 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                <div className={classes.containerTitle} >

                        <p className="display-4 p-3" ><b>Zabiegi chemiczne</b></p>
                    </div>
                    <div className="row" style={{ bottom: "0" }}>
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
                        onEdit={handleEdit}                        
                        onDelete={handleDelete}
                        auth="true"
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
                                    <Form.Label column sm={4}>Powierzchnia uprawy [ha] ({
                                        selectedCultivation && selectedCultivation.area 
                                            ? `${Number(selectedCultivation.area)})`
                                            : `${Number(selectedChemTreatment.maxArea)})`
                                    } </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="number"
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            step={0.10}
                                            min={0.1}
                                            max={(selectedCultivation && selectedCultivation.area ? Number(selectedCultivation.area) : Number(selectedChemTreatment.maxArea))}
                                            name="Area"
                                            isInvalid={validated &&
                                                (area > 0
                                                || area < (selectedCultivation && selectedCultivation.area ? Number(selectedCultivation.area) : Number(selectedChemTreatment.maxArea)))
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Powierzchnia na której wykonano zabieg musi być mniejsza lub równa powierzchni uprawy.
                                        </Form.Control.Feedback>
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
                                    <Form.Label column sm={4}>Dawka środka (
                                        {`${selectedChemAgent && selectedChemAgent.minDose ? selectedChemAgent.minDose : selectedChemTreatment.minDose }l
                                        -  ${selectedChemAgent && selectedChemAgent.maxDose ? selectedChemAgent.maxDose : selectedChemTreatment.maxDose}l`}
                                        )</Form.Label>
                                    <Col sm={8}>
                                    <Form.Control
                                        type="number"
                                            value={dose}           
                                            onChange={(e) => setDose(e.target.value)}
                                            min={selectedChemAgent && selectedChemAgent.minDose ? selectedChemAgent.minDose : selectedChemTreatment.minDose}
                                            max={selectedChemAgent && selectedChemAgent.maxDose ? selectedChemAgent.maxDose : selectedChemTreatment.maxDose}
                                            step="0.10"
                                            isInvalid={validated &&
                                                (dose > (selectedChemAgent && selectedChemAgent.minDose ? selectedChemAgent.minDose : selectedChemTreatment.minDose)
                                                || dose < (selectedChemAgent && selectedChemAgent.maxDose ? selectedChemAgent.maxDose : selectedChemTreatment.maxDose))
                                            }
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
                                        defaultValue={editMode && selectedChemTreatment ? new Date(selectedChemTreatment.date).toISOString().split('T')[0]  : ""}                                       
                                        required
                                       name="Date"
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
                                        required name="Reason"
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
       
        return { isError: true, message: "An unexpected error occurred" };
    }
    
   
}
export async function action({ request, params }) {
    const token = localStorage.getItem("token");
    const data = await request.formData();
    const formObject = Object.fromEntries(data.entries());
  
    const method = request.method;
    
    let url = 'https://localhost:44311/agrochem/chemicaltreatment';

    // Jeśli to metoda PUT, dodaj ID użytkownika do URL
    if (method === 'PUT') {
        const id = formObject.id; // Zakładamy, że ID jest w formularzu
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
        return json({ status: 'error', message: error.message }); // Wyświetl błąd

    }
}
export async function deleteChemicalTreatment(id) {
    const token = localStorage.getItem("token");
    const url = `https://localhost:44311/agrochem/chemicaltreatment/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
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
            return { status: 'error', message: errorData.message || 'Wystąpił błąd podczas usuwania.' };
        }
    } catch (error) {
        return { status: 'error', message: 'Nie udało się usunąć.' };
    }
}