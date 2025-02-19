import classes from './ChemicalAgentDetails.module.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Dropdown, Button, Card,  Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useLoaderData, json, useSubmit, useActionData, useRevalidator, useParams } from 'react-router-dom';
import UniversalTable from '../components/Table';
import useActionEffect from '../hooks/useActionEffect';
import archiveHandler from '../utils/ArchiveHandler';
import { isAdmin } from '../utils/authUtil';

const ChemicalAgentDetails = () => {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const submit = useSubmit();
    const actionData = useActionData();
    const [showDropdown, setShowDropdown] = useState(false);
    const { plants, chemicalUses, isError, message, name, type, description, photo } = useLoaderData();
    const [filteredPlants, setFilteredPlants] = useState(plants);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [selectedChemUse, setSelectedChemUse] = useState(null);
    const { id } = useParams();
    const { revalidate } = useRevalidator();
    const [rows, setRows] = useState([]);

    useActionEffect(actionData, revalidate, setShow);

    useEffect(() => {
        if (chemicalUses && Array.isArray(chemicalUses)) {
           
            const mappedRows = chemicalUses.map((item) => ({
                id: item.chemUseId,
                plantName: item.plantName,
                minDose: item.minDose,
                maxDose: item.maxDose,
                minWater: item.minWater,
                maxWater: item.maxWater,
                minDays: item.minDays,
                maxDays: item.maxDays,
                numberOfTreatments: item.numberOfTreatments,
                originalData: item, 
            }));

            setRows(mappedRows); 

        }
    }, [chemicalUses]);
    if (isError) {
        return <p>Błąd: {message}</p>;
    }

    const columns = [
        { field: 'plantName', headerName: 'Roślina', minWidth: 200, headerAlign: 'center' },
        { field: 'minDose', headerName: 'Dawka min[l]', minWidth: 120, headerAlign: 'center' },
        { field: 'maxDose', headerName: 'Dawka max[l]', minWidth: 120, headerAlign: 'center' },
        { field: "minWater", headerName: "Woda min[l]", minWidth: 120, headerAlign: 'center' },
        { field: "maxWater", headerName: "Woda max[l]", minWidth: 120, headerAlign: 'center' },
        { field: "minDays", headerName: "Ponownie min[dni]", minWidth: 140, headerAlign: 'center' },
        { field: "maxDays", headerName: "Ponownie max[l]", minWidth: 140, headerAlign: 'center' },
        { field: "numberOfTreatments", headerName: "Ilość zabiegów", minWidth: 120, headerAlign: 'center' }
    ];
  
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
        setSearchTerm(plant.name); 
        setShowDropdown(false); 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            const formData = new FormData(form);           
            formData.append('chemAgentId', id);
            formData.append('plantId', Number(selectedPlant.plantId));
          
            if (editMode) {
                formData.append('id', selectedChemUse.chemUseId); 
                submit(formData, { method: 'PUT' });
            } else {
                submit(formData, { method: 'POST' });
            }
            handleClose();          
        }
    };
   
    const handleEdit = (chemicalUse) => {
        setEditMode(true);
        setSelectedChemUse(chemicalUse);
        setSearchTerm(chemicalUse.plantName);
        setSelectedPlant({ plantId: chemicalUse.plantId, plantName: chemicalUse.plantName });
        setShow(true);
    };

    const handleArchive = (chemUse, isArchiving) => {
        archiveHandler(chemUse.chemUseId, isArchiving, archiveChemAgnet, revalidate);
    };

    return (
       <>       
  
                <div class="row">
                    <div className={classes.container}>                
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
                                                    src={photo}
                                                    alt="Profile"
                                                    className={classes.profileImg} />
                                            </div>

                                            <Card.Body style={{ marginTop: '60px' }}>
                                                <Card.Title className={classes.cardTitle}>{name}</Card.Title>
                                                <Card.Text className={classes.cardText}>
                                                    <p style={{ color: '#6c757d', fontSize:'14px', textAlign:'center' } }>[{type}]</p>
                                                    {description}</Card.Text>
                                                {isAdmin() && < Button variant="danger" size="md" style={{ float: 'right', marginBottom: '0px' }} onClick={handleShow} >Dodaj szczegóły</Button>}
                                            </Card.Body>
                                        </Card>

                                        
                                    </div>
                                </div>
                            </div>
                        </div>                 
                </div>

                <div className="row text-center mt-5" style={{ width: "1800px" }}>
                    
                        <p className="display-6 mb-5">Szczegółowe informacje </p>
                        <UniversalTable
                        key={JSON.stringify(rows)}
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit}
                        onArchive={handleArchive}
                        auth={isAdmin()}
                        archivalField="archival"
                        title={`Informacje o ${name}` }
                        />
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
                                <Form.Control
                                    type="text"
                                    placeholder="Wpisz, aby wyszukać..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowDropdown(true)}
                                    required
                                />
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
                            <Form.Label column sm={6}>Dawka minimalna l/kg</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="minDose"
                                    step="0.05"
                                    min="0.05"
                                    max="9999.99"
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.minDose : ''}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-4" controlId="maxDose">
                            <Form.Label column sm={6}>Dawka maksymalna [l]</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    required name="maxDose"
                                    step="0.05"
                                    min="0.05"
                                    max="9999.99"
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.maxDose : ''}
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
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4" controlId="numberOfTreatments">
                            <Form.Label column sm={6}>Ilość zabiegów</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    name="numberOfTreatments"
                                    step="1"
                                    min="1"
                                    max="10"
                                    defaultValue={editMode && selectedChemUse ? selectedChemUse.numberOfTreatments : ''}
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

export default ChemicalAgentDetails;
export async function loader({ params }) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const { id } = params;
    try {
        const [detailsResponse,plantsResponse, chemicaluseResponse] = await Promise.all([
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/chemicalagents/${id}`, { method: 'GET', headers }),
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/plants`, { method: 'GET', headers }),
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/chemicaluse/${id}`, { method: 'GET', headers }) // Drugi endpoint
        ]);
        if (!plantsResponse.ok || !chemicaluseResponse.ok || !detailsResponse.ok) {
            return {
                isError: true,
                message: "Failed to fetch data",
            };
        }

        const [plants, chemicalUses, details] = await Promise.all([
            plantsResponse.json(),
            chemicaluseResponse.json(),
            detailsResponse.json()
        ]);
        console.log(chemicalUses);
        return { plants, chemicalUses, isError: false, message: "", name: details.name, type: details.type, description: details.description, photo: details.photo };

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
  
    const method = request.method;

    let url = `${process.env.REACT_APP_API_URL}/agrochem/chemicaluse`;

    if (method === 'PUT') {
        const id = formObject.id; 
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
        return json({ status: 'error', message: result.message }, { status: response.status });
    }

    return json({ status: 'success', message: result.message }, { status: 200 });
}
export async function archiveChemAgnet(chemAgenId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_API_URL}/agrochem/chemicaluse/archive/${chemAgenId}?archive=${isArchiving}`;
    
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
        return { status: 'error', message: 'Nie udało się przeprowadzić operacji dla tej informacji.' };
    }
}
