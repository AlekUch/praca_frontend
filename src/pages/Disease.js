import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Disease.module.css';
import { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import {  DropdownButton } from 'react-bootstrap';
import UniversalTable from '../components/Table';
import deleteHandler from '../utils/DeleteHandler';
import { Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import useActionEffect from '../hooks/useActionEffect';
import Swal from 'sweetalert2';
import { isAdmin } from '../utils/authUtil';

function Disease() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [plants, setPlants] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const data = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const dropdownRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [photo, setPhoto] = useState();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({
        name:"",
        characteristic: "",
        reasons: "",
        prevention:"",
        file: null,
        plantDisease: [], // Tablica na ID wybranych produktów
    });
    
    useActionEffect(actionData, revalidate, setShow);
    
    useEffect(() => {
        // Pobierz listę produktów z backendu
        const fetchPlants = async () => {
            try {
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
                    const result = await response.json();
                    setPlants(result);
                    
                }
            } catch (error) {
                console.error("Błąd podczas pobierania listy roślin:", error);
            }
        };

        fetchPlants();
    }, []);

    useEffect(() => {
        if (data && Array.isArray(data)) {
          
            const mappedRows = data.map((item) => ({
                id: item.diseaseId,
                name: item.name,
                characteristic: item.characteristic,
                reasons: item.reasons,
                plantDiseases: item.plantDiseases,
                prevention: item.prevention,
                photo: (
                    <img
                        src={item.photo}
                        alt={item.photoName}
                        style={{ width: "200px", height: "auto" }}
                    />
                ),
                originalData: item,
                details: (
                    <IconButton
                        onClick={() => navigate(`/disease/${item.diseaseId}`)} // Funkcja do kliknięcia
                        color="primary"
                    >
                        <Visibility />
                    </IconButton>)
            }));
           
            setRows(mappedRows); // Ustawiamy dane w stanie
            
        }
    }, [data, navigate]);
    
    const columns = [
        { field: 'name', headerName: 'Nazwa', minWidth: 200, headerAlign: 'center' },
        { field: 'characteristic', headerName: 'Charakterystyka', flex:1,minWidth: 200, headerAlign: 'center' },
        { field: 'reasons', headerName: 'Przyczyna', minWidth: 200, headerAlign: 'center' },
        { field: "plantDiseases", headerName: "Atakowane rośliny", minWidth: 200, headerAlign: 'center' },
        { field: "prevention", headerName: "Zwalczanie", minWidth:200, headerAlign: "center" },
        { field: "photo", headerName: "Zdjęcie", minWidth: 150, headerAlign: 'center' },
        { field: "details", headerName: "Szczegóły", minWidth: 100, headerAlign: 'center' },
    ];

    

    const handleShow = () => setShow(true);

    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            const data = new FormData(form);
            data.set("Characteristic", formData.characteristic || "");
            data.set("Name", formData.name || "");
            data.set("Reasons", formData.reasons || "");
            formData.plantDisease.forEach((id) => {
                data.append("PlantDisease", id);
            });

            const token = localStorage.getItem("token");
            let url = 'https://localhost:44311/agrochem/disease';
            let method = "POST";

            if (editMode) {
                url = `${url}/${selectedDisease.diseaseId}`;
                method = 'PUT';
            }
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        // 'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: data,
                });

                if (!response.ok) {
                    const result = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Błąd',
                        text: result.message,
                    }).then(() => {
                        
                         setShow(false);
                    });
                } else {
                    
                    const result = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukces',
                        text: result.message,
                    }).then(() => {
                         revalidate();
                         setShow(false);
                    });
                }

            } catch (error) {
                return json({ status: 'error', message: error.message }); // Wyświetl błąd

            }
        }
        handleClose();
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
       
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
        const photo = e.target.files[0];
        if (photo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);  // Ustawienie prewizualizacji wybranego obrazu
            };
            reader.readAsDataURL(photo);
            setPhoto(photo);  // Ustawienie wybranego pliku
        }
    };

    const handleCheckboxChange = (plantId) => {
        setFormData((prev) => {
            const isSelected = prev.plantDisease.includes(plantId);
            const updatedSelectedPlants = isSelected
                ? prev.plantDisease.filter((id) => id !== plantId) // Usuń produkt, jeśli jest już zaznaczony
                : [...prev.plantDisease, plantId]; // Dodaj produkt, jeśli jest niezaznaczony

            return { ...prev, plantDisease: updatedSelectedPlants };
        });
    };

    const handleEdit = (disease) => {
        
        setEditMode(true);
        setFormData((prev) => ({
            name: disease.name,
            characteristic: disease.characteristic,
            reasons: disease.reasons,
            prevention: disease.prevention,
            file: null,
            plantDisease: disease.plantsId.split(',').map(Number)
        }));
        setPreview(disease.photo);
        setSelectedDisease(disease);
        setShow(true);
    };

    const handleClose = () => {
        setEditMode(false);
        setSelectedDisease(null);
        setFormData((prev) => ({
        name: "",
            characteristic: "",
            reasons: "",
            prevention:"",
            file: null,
            plantDisease: [],
        }));
        setPreview(null);
        setShow(false);
    };
    const handleDelete = (disease) => {
        deleteHandler(disease.diseaseId, deleteDisease, revalidate);
    }

    const renderSelectedPlants = () =>
        formData.plantDisease
            .map((id) => plants.find((p) => p.plantId === id)?.name)
            .join(", ");

    return (
        <>
            <div style={{ width: '100%' }} className="p-3 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                    <div className={classes.containerTitle} >
                        <p className="display-4"><b>Choroby roślin</b></p>
                    </div>
                <div class="row">
                    <div className="col d-flex justify-content-end">
                            {isAdmin() && <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nową chorobę</Button>}
                        </div>
                    </div>
                </div>
                <div className={classes.container}>
                   
                    <UniversalTable
                        key={JSON.stringify(rows)}
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit} // Funkcja obsługująca edycję
                        onDelete={handleDelete} // Funkcja obsługująca archiwizację
                        auth={isAdmin()}
                        archivalField="archival" // Nazwa pola archiwizacji (dynamiczne)
                        title="Choroby roślin"
                    />
                </div>
                <Modal show={show} onHide={handleClose} size="xl" className={classes.modal} >
                    <Modal.Header closeButton >
                        <Modal.Title className={classes.modalTitle}>
                            {editMode ? 'Edytuj chorobę' : 'Utwórz nową chorobę'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit} encType="multipart/form-data">
                            <Form.Group as={Row} className="mb-4" controlId="Name">
                                <Form.Label column sm={2}>
                                    Nazwa choroby
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        //defaultValue={editMode && selectedDisease ? selectedDisease.name : ''}
                                        required name="name"
                                       // defaultValue={editMode && selectedPlant ? selectedPlant.name : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-4" controlId="Characterisctic">
                                <Form.Label column sm={2}>
                                   Charakterystyka
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control 
                                        as="textarea"
                                        value={formData.characteristic}
                                        onChange={handleInputChange}
                                        maxLength={2000}
                                        rows={5}
                                        //defaultValue={editMode && selectedDisease ? selectedDisease.characteristic : ''}
                                        required name="characteristic"
                                        
                                       // defaultValue={editMode && selectedPlant ? selectedPlant.rotationPeriod : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Reason">
                                <Form.Label column sm={2}>
                                    Przyczyna
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        value={formData.reasons}
                                        onChange={handleInputChange}
                                        defaultValue={editMode && selectedDisease ? selectedDisease.reasons : ''}
                                        required name="reasons"
                                    // defaultValue={editMode && selectedPlant ? selectedPlant.name : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="plantDisease">
                                <Form.Label column sm={2}>
                                  Atakowane rośliny
                                </Form.Label>
                                <Col sm={10}>
                                    <DropdownButton
                                        ref={dropdownRef}
                                        title={renderSelectedPlants() || "Wybierz rośliny"}
                                        variant="secondary"
                                        className="col-1"
                                       
                                    >
                                        {plants.map((plant) => (
                                            <Form.Check
                                                key={plant.plantId}
                                                type="checkbox"
                                                label={plant.name}
                                                value={plant.plantId}
                                                checked={formData.plantDisease.includes(plant.plantId)}
                                                onChange={() => handleCheckboxChange(plant.plantId)}
                                                style={{ padding: "0.5rem 5rem",width:"300px" }}
                                            />
                                        ))}
                                    </DropdownButton>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Prevention">
                                <Form.Label column sm={2}>
                                    Zwalczanie
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        as="textarea"
                                        value={formData.prevention}
                                        onChange={handleInputChange}
                                        maxLength={1000}
                                        rows={3}
                                        //defaultValue={editMode && selectedDisease ? selectedDisease.characteristic : ''}
                                        required name="prevention"

                                    // defaultValue={editMode && selectedPlant ? selectedPlant.rotationPeriod : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4"  controlId="File">
                                <Form.Label column sm={2}>
                                    Plik
                                </Form.Label>
                                <Col sm={10}>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                   // required
                                    />
                                    <div>
                                        <p style={{float:"left"} }>Obecny obraz:</p>
                                        <img
                                            src={preview}
                                            alt="Nie wybrano obrazu"
                                            style={{ maxWidth: '300px', marginTop: '10px' }}
                                        />
                                    </div>
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

export default Disease;

export async function loader() {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://localhost:44311/agrochem/disease`, {
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
    Object.entries(formObject).forEach(([key, value]) => {
        if (value === "") formObject[key] = null;
    });

  
    const file = data.get("file");

   
    data.forEach((value, key) => {
        // Specjalna obsługa dla PlantDisease
        if (key === "PlantDisease") {
            if (!Array.isArray(formObject[key])) {
                formObject[key] = []; // Inicjalizacja jako tablica
            }
            formObject[key].push(parseInt(value, 10)); // Dodanie liczby do tablicy
        } else {
            formObject[key] = value; // Pozostałe klucze bez zmian
        }
    });

    if (formObject.PlantDisease) {
        formObject.PlantDisease = formObject.PlantDisease.map((id) => parseInt(id, 10));
    }
   
    const method = request.method;
 
    let url = 'https://localhost:44311/agrochem/disease';

    if (method === 'PUT') {
        const id = formObject.id; 
        url = `${url}/${id}`;
    }
  
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
               // 'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: data,
        });

        if (!response.ok) {
            const result = await response.json();
            return json({ status: 'error', message: result.message }, { status: response.status });
        } else {
            const result = await response.json();
            return json({ status: 'success', message: result.message }, { status: 200 });
        }
    } catch (error) {
        return json({ status: 'error', message: error.message }); 

    }
 }

export async function deleteDisease(id) {
    const token = localStorage.getItem("token");
    const url = `https://localhost:44311/agrochem/disease/delete/${id}`;
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
 