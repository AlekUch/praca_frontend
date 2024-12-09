import classes from './ChemicalAgentDetails.module.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Dropdown, Button, Card, Table, Modal } from 'react-bootstrap';

import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator, useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const DetailsPage = () => {
    const location = useLocation();
    const { state } = location || {};
    const { name, type, description } = state || {};
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedChemAgent, setSelectedChemAgent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const submit = useSubmit();
    const actionData = useActionData();
    const [showDropdown, setShowDropdown] = useState(false);
    const { plants, chemicalUses, isError, message } = useLoaderData();
    const [filteredPlants, setFilteredPlants] = useState(plants);
    const [selectedPlant, setSelectedPlant] = useState(null);

    if (isError) {
        return <p>Błąd: {message}</p>;
    }
    const handleShow = () => setShow(true);

    const handleClose = () => {
        setEditMode(false);
        setSelectedChemAgent(null);
        setShow(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
    };

    const handleSelectPlant = (plant) => {
        setSelectedPlant(plant);
        setSearchTerm(plant.name); // Ustaw nazwę w polu tekstowym
        setShowDropdown(false); // Zamknięcie dropdownu
    };
    if (!state) {
        return <p>Brak danych do wyświetlenia</p>;
    }

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
              //  submit(dataToSend, { method: 'POST' });
            }

            handleClose();
        

    };
   

    return (
       <>       
        <div id="team" class="pb-5 ">
                <div className={classes.container}>                
                <div class="row">
                    <div class="col-12 ">
                        <div class="image-flip" >
                            <div class="mainflip flip-0">
                                    <div class="frontside">
                                        <Card className="text-center" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                                            <Card.Img
                                                variant="top"
                                                src="/registrationimage.jpg"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />

                                            <div className={classes.profilePicture}>
                                                <img
                                                    src="/chemAgent.png"
                                                    alt="Profile"
                                                    className={classes.profileImg} />
                                            </div>

                                            <Card.Body style={{ marginTop: '60px' }}>
                                                <Card.Title className={classes.cardTitle}>{name}</Card.Title>
                                                <Card.Text className={classes.cardText}>{description}</Card.Text>
                                                <Button variant="danger" size="md" style={{ float: 'right', marginBottom: '0px' }} onClick={handleShow} >Dodaj szczegóły</Button>
                                            </Card.Body>
                                        </Card>

                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row text-center mt-5">
                        <p className="display-6 mb-5">Szczegółowe informacje </p>
                        <Table responsive >
                            <thead >
                                <tr >
                                    <th>Roślina</th>
                                    <th>Dawka minimalna [l]</th>
                                    <th>Dawka maksymalna [l]</th>
                                    <th>Woda min [l]</th>
                                    <th>Woda max [l]</th>
                                    <th>Min do ponownego zabiegu [dni]</th>
                                    <th>Max do ponownego zabiegu [dni]</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chemicalUses && chemicalUses.map(chemicalUse => (
                                    <tr key={chemicalUse.plant.Name}>
                                        <td>{chemicalUse.minDose}</td>
                                        <td>{chemicalUse.maxDose}</td>
                                        <td>{chemicalUse.minWater}</td>
                                        <td>{chemicalUse.maxWater}</td>
                                        <td>{chemicalUse.minDays}</td>
                                        <td>{chemicalUse.maxDays}</td>
                                        {/*<td>*/}
                                        {/*    {chemicalUse.archival === false ? (*/}
                                        {/*        <>*/}

                                        {/*            <OverlayTrigger*/}
                                        {/*                placement="top"*/}
                                        {/*                overlay={renderTooltip('Edytuj')}*/}
                                        {/*            >*/}
                                        {/*                <i*/}
                                        {/*                    className="bi bi-pencil-square"*/}
                                        {/*                    style={{ cursor: 'pointer', marginRight: '10px' }}*/}
                                        {/*                    onClick={() => handleEdit(chemicalUse)}*/}
                                        {/*                />*/}
                                        {/*            </OverlayTrigger>*/}


                                        {/*            <OverlayTrigger*/}
                                        {/*                placement="top"*/}
                                        {/*                overlay={renderTooltip('Archiwizuj')}*/}
                                        {/*            >*/}
                                        {/*                <i*/}
                                        {/*                    className="bi bi-archive"*/}
                                        {/*                    style={{ cursor: 'pointer', color: 'red' }}*/}
                                        {/*                    onClick={() => handleArchive(chemicalUse, true)}*/}
                                        {/*                />*/}
                                        {/*            </OverlayTrigger>*/}

                                        {/*        </>*/}
                                        {/*    ) : (*/}
                                        {/*        <>*/}

                                        {/*            <OverlayTrigger*/}
                                        {/*                placement="top"*/}
                                        {/*                overlay={renderTooltip('Cofnij archiwizację')}*/}
                                        {/*            >*/}
                                        {/*                <i*/}
                                        {/*                    className={"bi bi-arrow-counterclockwise"}*/}
                                        {/*                    style={{ cursor: 'pointer', color: 'green' }}*/}
                                        {/*                    onClick={() => handleArchive(chemicalUse, false)}*/}
                                        {/*                />*/}
                                        {/*            </OverlayTrigger>*/}
                                        {/*        </>*/}
                                        {/*    )}*/}
                                        {/*    <OverlayTrigger*/}
                                        {/*        placement="top"*/}
                                        {/*        overlay={renderTooltip('Szczegóły')}*/}
                                        {/*    >*/}
                                        {/*        <i*/}
                                        {/*            className={"bi bi-three-dots"}*/}
                                        {/*            style={{ cursor: 'pointer', color: 'green' }}*/}
                                        {/*            onClick={() => handleDetailsClick(chemicalUse)}*/}
                                        {/*        />*/}
                                        {/*    </OverlayTrigger>*/}
                                        {/*</td>*/}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}  className={classes.modal} >
                <Modal.Header closeButton >
                    <Modal.Title className={classes.modalTitle}>
                        {editMode ? 'Edytuj informację' : 'Utwórz nową imformację'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit}>
                       

                        <Form.Group as={Row} className="mb-4" controlId="productSelect">
                            <Form.Label column sm={6}>Wybierz rośline</Form.Label>
                            <Col sm={6}>
                                {/* Pole wyszukiwania */}
                                <Form.Control
                                    type="text"
                                    placeholder="Wpisz, aby wyszukać..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowDropdown(true)}
                                    required
                                />

                                {/* Dropdown z wynikami */}
                                {showDropdown && (
                                    <Dropdown.Menu show style={{ width: '100%', maxHeight: '200px', overflowY: 'auto' }}>
                                        {filteredPlants.length > 0 ? (
                                            filteredPlants.map(plant => (
                                                <Dropdown.Item
                                                    key={plant.plantId}
                                                    onClick={() => handleSelectPlant(plant)}
                                                >
                                                    {plant.name}
                                                </Dropdown.Item>
                                            ))
                                        ) : (
                                            <Dropdown.Item disabled>Brak wyników</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                )}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-4" controlId="minDose">
                            <Form.Label column sm={6}>Dawka minimalna [l]</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="minDose"
                                    step="0.10"
                                    min="0.10"
                                    max="9999.99"
                                    //value={dateValue}
                                   // onChange={(e) => setDateValue(e.target.value)}
                                    required
                                   // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-4" controlId="maxDose">
                            <Form.Label column sm={6}>Dawka maksymalna [l]</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="maxDose"
                                    step="0.10"
                                    min="0.10"
                                    max="9999.99"
                                    //value={dateValue}
                                    // onChange={(e) => setDateValue(e.target.value)}
                                    required
                                // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4" controlId="minWater">
                            <Form.Label column sm={6}>Woda dawka minimalna [l]</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="minWater"
                                    step="0.10"
                                    min="0.10"
                                    max="9999.99"
                                    //value={dateValue}
                                    // onChange={(e) => setDateValue(e.target.value)}
                                    required
                                // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4" controlId="maxWater">
                            <Form.Label column sm={6}>Woda dawka maksymalna [l]</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="maxWater"
                                    step="0.10"
                                    min="0.10"
                                    max="9999.99"
                                    //value={dateValue}
                                    // onChange={(e) => setDateValue(e.target.value)}
                                    required
                                // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4" controlId="minDays">
                            <Form.Label column sm={6}>Dni do następnego zabiegu (min)</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="minDays"
                                    step="1"
                                    min="1"
                                    max="365"
                                    //value={dateValue}
                                    // onChange={(e) => setDateValue(e.target.value)}
                                    required
                                // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4" controlId="maxDays">
                            <Form.Label column sm={6}>Dni do następnego zabiegu (max)</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="maxDays"
                                    step="1"
                                    min="1"
                                    max="365"
                                    //value={dateValue}
                                    // onChange={(e) => setDateValue(e.target.value)}
                                    required
                                // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                />
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
            
      </>
    )
};

export default DetailsPage;
export async function loader({ params }) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const { id } = params;
    // Pobieranie danych z dwóch endpointów równocześnie
    try {
        const [plantsResponse, chemicaluseResponse] = await Promise.all([
            fetch(`https://localhost:44311/agrochem/plants`, { method: 'GET', headers }),
            fetch(`https://localhost:44311/agrochem/chemicaluse/${id}`, { method: 'GET', headers }) // Drugi endpoint
        ]);
        console.log(plantsResponse);
        console.log(chemicaluseResponse);
        // Sprawdzanie statusów odpowiedzi
        if (!plantsResponse.ok || !chemicaluseResponse.ok) {
            return {
                isError: true,
                message: "Failed to fetch data",
            };
        }

        // Parsowanie danych
        const [plants, anotherEndpointData] = await Promise.all([
            plantsResponse.json(),
            chemicaluseResponse.json()
        ]);

        // Zwracanie danych do komponentu
        return { plants, anotherEndpointData };

    } catch (error) {
        console.error("Loader error:", error);
        return { isError: true, message: "An unexpected error occurred" };
    }
}