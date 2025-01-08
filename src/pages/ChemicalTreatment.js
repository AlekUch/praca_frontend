import classes from './DiseaseDetails.module.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Dropdown, Button, Card, Table, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator, useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useRouteLoaderData } from "react-router";
const MySwal = withReactContent(Swal);

const ChemicalTreatment = () => {
    const [show, setShow] = useState(false);
    //const data = useLoaderData();
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [plants, setPlants] = useState([]);
    const [cultivations, setCultivations] = useState([]);
    const [chemaAgents, setChemAgents] = useState([]);
    const [selectedChemTreatment, setSelectedChemTreatment] = useState(null);
    const [selectedCultivation, setSelectedCultivation] = useState(null);
    const [selectedChemAgent, setSelectedChemAgent] = useState(null);
    const [reason, setReason] = useState(null);
    const [date, setDate] = useState(null);
    const [dose, setDose] = useState(null);
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const dropdownRef = useRef(null);
    const [rows, setRows] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                
                const response = await fetch(`https://localhost:44311/agrochem/cultivations`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
                    }
                });              
                const data = await response.json();
                setCultivations(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchPlots();
    }, []);

    useEffect(() => {
        if (selectedCultivation) {
            const fetchChemAgent = async () => {
                try {
                    const response = await fetch(`https://localhost:44311/agrochem/chemicaluse/plant/${selectedCultivation.plantId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
                        }
                    });
                    const data = await response.json();
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

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setEditMode(false);
        setSelectedChemTreatment(null);
        
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {

            //if (editMode) {
            //    // Prześlij żądanie PUT
            //    const dataToSend = {
            //        area: inputValue,
            //        sowingDate: dateValue,
            //        plotId: selectedPlot,
            //        plantId: Number(selectedPlant.plantId),
            //        cultivationId: selectedCultivation.cultivationId
            //    };
            //    submit(dataToSend, { method: 'PUT' });
            //} else {
            //    // Prześlij żądanie POST
            //    const dataToSend = {
            //        area: inputValue,
            //        sowingDate: dateValue,
            //        plotId: selectedPlot,
            //        plantId: selectedPlant.plantId
            //    };
            //    submit(dataToSend, { method: 'POST' });
            //}

            handleClose();
        }

    };

    return (
        <>
            <div style={{ width: '100%' }} className="p-5 text-center bg-body-tertiary ">
                <p className="display-4">Zabiegi chemiczne</p>
                <div class="row">
                    <div className="col d-flex justify-content-end">
                        <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nowy zabieg</Button>
                    </div>
                </div>
                <div className={classes.container}>

                    {/*<UniversalTable*/}
                    {/*    key={JSON.stringify(rows)}*/}
                    {/*    columns={columns}*/}
                    {/*    rows={rows}*/}
                    {/*    onEdit={handleEdit} // Funkcja obsługująca edycję*/}
                    {/*    onArchive={handleArchive} // Funkcja obsługująca archiwizację*/}
                    {/*    archivalField="archival" // Nazwa pola archiwizacji (dynamiczne)*/}
                    {/*    title="Choroby roślin"*/}
                    {/*/>*/}
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
                                        value={selectedCultivation ? selectedCultivation.cultivationId : ''}
                                        onChange={(e) => {
                                            setSelectedChemAgent(null);
                                            const selected = cultivations.find(
                                                (cultivation) => cultivation.cultivationId === parseInt(e.target.value)
                                            );
                                            setSelectedCultivation(selected); // Zapisz cały obiekt produktu
                                        }}
                                        required

                                        isInvalid={validated && !selectedCultivation}>
                                        <option value="" >Wybierz z listy...</option>
                                        {cultivations.map(cultivation => (
                                            <option key={cultivation.cutivationId} value={cultivation.cultivationId}>{cultivation.plotNumber} - {cultivation.plantName} </option>

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
                                            value={`${Number(selectedCultivation.area)} ha`}

                                            readOnly
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
                                        value={selectedChemAgent ? selectedChemAgent.chemUseId : ''}
                                        onChange={(e) => {
                                            const selected = chemaAgents.find(
                                                (chemAgent) => chemAgent.chemUseId === parseInt(e.target.value)
                                            );
                                            setSelectedChemAgent(selected); // Zapisz cały obiekt produktu
                                        }}
                                        required

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
                                    <Form.Label column sm={4}>Dawka środka ({`${selectedChemAgent.minDose}l`} - {`${selectedChemAgent.maxDose}l`})</Form.Label>
                                    <Col sm={8}>
                                    <Form.Control
                                        type="number"
                                        value={dose}
                                        onChange={(e) => setDose(e.target.value)}
                                        min={selectedChemAgent.minDose}
                                            max={selectedChemAgent.maxDose}
                                            step="0.10"
                                        required
                                        />
                                    </Col>
                                </Form.Group>
                            )}

                            <Form.Group as={Row} className="mb-4" controlId="date">
                                <Form.Label column sm={4}>Data siewu</Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                       // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Reason">
                                <Form.Label column sm={4}>
                                    Przyczyna
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                       // defaultValue={editMode && selectedDisease ? selectedDisease.reasons : ''}
                                        required name="reasons"
                                    // defaultValue={editMode && selectedPlant ? selectedPlant.name : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            {/*<Form.Group as={Row} className="mb-4" controlId="PlantId">*/}
                            {/*    <Form.Label column sm={2}>*/}
                            {/*        Uprawa*/}
                            {/*    </Form.Label>*/}
                            {/*    <Col sm={10}>*/}
                            {/*        <Form.Control as="select"*/}
                            {/*            value={selectedPlot ? selectedPlot : ''}*/}
                            {/*            onChange={(e) => setSelectedPlot(e.target.value)}*/}
                            {/*            required*/}

                            {/*            isInvalid={validated && !selectedPlot}>*/}
                            {/*            <option value="" >Wybierz z listy...</option>*/}
                            {/*            {plots.map(plot => (*/}
                            {/*                <option key={plot.plotId} value={plot.plotId}>{plot.plotNumber} </option>*/}

                            {/*            ))}*/}
                            {/*        </Form.Control>*/}
                            {/*        <Form.Control.Feedback></Form.Control.Feedback>*/}

                            {/*    </Col>*/}
                            {/*</Form.Group>*/}

                            

                            

                            {/*<Form.Group as={Row} className="mb-4" controlId="Prevention">*/}
                            {/*    <Form.Label column sm={2}>*/}
                            {/*        Zwalczanie*/}
                            {/*    </Form.Label>*/}
                            {/*    <Col sm={10}>*/}
                            {/*        <Form.Control*/}
                            {/*            as="textarea"*/}
                            {/*            value={formData.prevention}*/}
                            {/*            onChange={handleInputChange}*/}
                            {/*            maxLength={1000}*/}
                            {/*            rows={3}*/}
                            {/*            //defaultValue={editMode && selectedDisease ? selectedDisease.characteristic : ''}*/}
                            {/*            required name="prevention"*/}

                            {/*        // defaultValue={editMode && selectedPlant ? selectedPlant.rotationPeriod : ''}*/}
                            {/*        />*/}
                            {/*        <Form.Control.Feedback></Form.Control.Feedback>*/}

                            {/*    </Col>*/}
                            {/*</Form.Group>*/}

                            

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