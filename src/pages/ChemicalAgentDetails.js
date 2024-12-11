import classes from './ChemicalAgentDetails.module.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Dropdown, Button, Card, Table, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator, useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useRouteLoaderData } from "react-router";
const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">{message}</Tooltip>
);

const MySwal = withReactContent(Swal);

const DetailsPage = () => {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const submit = useSubmit();
    const actionData = useActionData();
    const [showDropdown, setShowDropdown] = useState(false);
    const { plants, chemicalUses, isError, message, name, type, description } = useLoaderData();
    const [filteredPlants, setFilteredPlants] = useState(plants);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [selectedChemUse, setSelectedChemUse] = useState(null);
    const { id } = useParams();
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
    console.log(useLoaderData());
    if (isError) {
        return <p>Błąd: {message}</p>;
    }
    const handleShow = () => setShow(true);

    const handleClose = () => {
        setEditMode(false);
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


    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            const formData = new FormData(form);
            console.log(editMode);
            
            formData.append('chemAgentId', id);
            formData.append('plantId', Number(selectedPlant.plantId));

            console.log(formData);
            if (editMode) {

                formData.append('id', selectedChemUse.chemUseId); // Ustaw identyfikator użytkownika
                submit(formData, { method: 'PUT' });
            } else {
                submit(formData, { method: 'POST' });
            }
            handleClose();
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
            // }

            //handleClose();

        }
    };
   
    const handleEdit = (chemicalUse) => {

        setEditMode(true);
        setSelectedChemUse(chemicalUse);
        setSearchTerm(chemicalUse.plantName);
        setSelectedPlant({ plantId: chemicalUse.plantId, plantName: chemicalUse.plantName });
        //setSelectedCultivation(cultivation);
        //setInputValue(cultivation.area);
        //setSelectedPlot(cultivation.plotId);
        //setSearchTerm(cultivation.plantName);
        //setSelectedPlant({ plantId: cultivation.plantId, plantName: cultivation.plantName });
        //setDateValue(format(cultivation.sowingDate, 'yyyy-MM-dd'));
        //fetchPlotsArea();

        setShow(true);
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
                                        <Card className="text-center" style={{ width: '90%',margin:'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
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
                                    <th>Dawka min [l]</th>
                                    <th>Dawka max [l]</th>
                                    <th>Woda min [l]</th>
                                    <th>Woda max [l]</th>
                                    <th>Ponowny zabieg min [dni]</th>
                                    <th>Ponowny zabieg max [dni]</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {chemicalUses && chemicalUses.map(chemicalUse => (
                                    <tr key={chemicalUse.chemUseId}>
                                        <td>{chemicalUse.plantName}</td>
                                        <td>{chemicalUse.minDose}</td>
                                        <td>{chemicalUse.maxDose}</td>
                                        <td>{chemicalUse.minWater}</td>
                                        <td>{chemicalUse.maxWater}</td>
                                        <td>{chemicalUse.minDays}</td>
                                        <td>{chemicalUse.maxDays}</td>
                                        <td>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={renderTooltip('Edytuj')}
                                            >
                                                <i
                                                    className="bi bi-pencil-square"
                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                    onClick={() => handleEdit(chemicalUse)}
                                                />
                                            </OverlayTrigger>


                                            <OverlayTrigger
                                                placement="top"
                                                overlay={renderTooltip('Usuń')}
                                            >
                                                <i
                                                    className="bi bi-archive"
                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                   
                                                />
                                            </OverlayTrigger>
                                              
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} className={classes.modal} >
                <Modal.Header closeButton >
                    <Modal.Title className={classes.modalTitle}>
                        {editMode ? 'Edytuj informację' : 'Utwórz nową informację'}
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
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.minDose : ''}
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
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.maxDose : ''}
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
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.minWater : ''}
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
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.maxWater : ''}
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
                                    name="minDays"
                                    step="1"
                                    min="1"
                                    max="365"
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.minDays : ''}
                                    //value={dateValue}
                                    // onChange={(e) => setDateValue(e.target.value)}
                                 
                                // isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4" controlId="maxDays">
                            <Form.Label column sm={6}>Dni do następnego zabiegu (max)</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    name="maxDays"
                                    step="1"
                                    min="1"
                                    max="365"
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.maxDays : ''}
                                    //value={dateValue}
                                    // onChange={(e) => setDateValue(e.target.value)}
                                    
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
        const [detailsResponse,plantsResponse, chemicaluseResponse] = await Promise.all([
            fetch(`https://localhost:44311/agrochem/chemicalagents/${id}`, { method: 'GET', headers }),
            fetch(`https://localhost:44311/agrochem/plants`, { method: 'GET', headers }),
            fetch(`https://localhost:44311/agrochem/chemicaluse/${id}`, { method: 'GET', headers }) // Drugi endpoint
        ]);
        console.log(detailsResponse);
        console.log(chemicaluseResponse);
        // Sprawdzanie statusów odpowiedzi
        if (!plantsResponse.ok || !chemicaluseResponse.ok || !detailsResponse.ok) {
            return {
                isError: true,
                message: "Failed to fetch data",
            };
        }

        // Parsowanie danych
        const [plants, chemicalUses, details] = await Promise.all([
            plantsResponse.json(),
            chemicaluseResponse.json(),
            detailsResponse.json()
        ]);
        console.log(details);
        // Zwracanie danych do komponentu
        return { plants, chemicalUses, isError: false, message: "", name: details.name, type: details.type, description: details.description };

    } catch (error) {
        console.error("Loader error:", error);
        return { isError: true, message: "An unexpected error occurred" };
    }
}

export async function action({ request, params }) {
    const token = localStorage.getItem("token");
    const data = await request.formData();
    const formObject = Object.fromEntries(data.entries());
    Object.entries(formObject).forEach(([key, value])=> {
        if(value === "")formObject[key] = null;
        });
    console.log(formObject);
    const method = request.method;
    console.log(request
        .method);
    // URL bazowy
    let url = 'https://localhost:44311/agrochem/chemicaluse';

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
        return json({ status: 'error', message: result.message }, { status: response.status });
    }

    return json({ status: 'success', message: result.message }, { status: 200 });
}