import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Cultivations.module.css';
import { useState, useEffect } from 'react';
import { Form, Row, Col, Dropdown, Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import { format } from 'date-fns';
import UniversalTable from '../components/Table';
import useActionEffect from '../hooks/useActionEffect';
import deleteHandler from '../utils/DeleteHandler';
import archiveHandler from '../utils/ArchiveHandler';

function Cultivations() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [selectedCultivation, setSelectedCultivation] = useState(null);
    const { cultivations, archivalCultivations, plants, isError, message } = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const [plotsArea, setPlotsArea] = useState([]); 
    const [maxArea, setMaxArea] = useState(0); 
    const [inputValue, setInputValue] = useState(''); 
    const [dateValue, setDateValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlants, setFilteredPlants] = useState(plants);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [rows, setRows] = useState([]);
    const [archivalRows, setArchivalRows] = useState([]);

    useActionEffect(actionData, revalidate, setShow);

    useEffect(() => {

        if (Array.isArray(plants)) {
            const filtered = plants.filter(plant =>
                plant.name && plant.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setFilteredPlants(filtered);
        }
    }, [searchTerm, plants]);

    useEffect(() => {
        if (cultivations && Array.isArray(cultivations)) {
            const mappedRows = cultivations.map((item) => ({
                id: item.cultivationId,
                plotNumber: item.plotNumber,
                plantName: item.plantName,
                area: `${item.area} ha`,
                sowingDate: new Date(item.sowingDate).toLocaleDateString("pl-PL"),
                originalData: item,
            }));
            setRows(mappedRows); 
        }
    }, [cultivations]);

    useEffect(() => {
        if (archivalCultivations && Array.isArray(archivalCultivations)) {

            const mappedRows = archivalCultivations.map((item) => ({
                id: item.cultivationId,
                plotNumber: item.plotNumber,
                plantName: item.plantName,
                area: `${item.area} ha`,
                sowingDate: new Date(item.sowingDate).toLocaleDateString("pl-PL"),
                originalData: item,
            }));
            setArchivalRows(mappedRows); 

        }
    }, [archivalCultivations]);

    const columns = [
        { field: 'plotNumber', headerName: 'Numer działki', flex: 1, headerAlign: 'center' },
        { field: 'plantName', headerName: 'Uprawiana roślina', flex: 1, headerAlign: 'center' },
        { field: 'area', headerName: 'Powierzchnia', flex: 1, headerAlign: 'center' },
        { field: 'sowingDate', headerName: 'Data siewu', flex: 1, headerAlign: 'center' },       
    ];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
    };

    const handleSelectPlant = (plant) => {
        setSelectedPlant(plant);
        setSearchTerm(plant.name); 
        setShowDropdown(false); 
    };
 
    const fetchPlotsArea = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/plots/plotsArea`, {
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
                setPlotsArea(result);
                
            }
        } catch (error) {
            console.error('Błąd pobierania działek:', error);
        }
    };

    const handleShow = () => {
        setShow(true);
        fetchPlotsArea();
    };

    if (isError) {
        return <p>Błąd: {message}</p>;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;       
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            const dataToSend = {
                area: inputValue,
                sowingDate: dateValue,
                plotId: selectedPlot,
                plantId: Number(selectedPlant.plantId),               
            };
            if (editMode) {
                dataToSend.cultivationId = selectedCultivation.cultivationId;
                submit(dataToSend, { method: 'PUT' });
            } else {
                
                submit(dataToSend, { method: 'POST' });
            }
            handleClose();  
        }               
    };

    const handleSelectChange = (e) => {
        const plotId = e.target.value;
        const plot = plotsArea.find(plot => plot.plotId.toString() === plotId); // Znajdź użytkownika po ID
        setSelectedPlot(plotId); // Ustaw ID wybranego użytkownika
        setMaxArea(plot ? plot.area : 0); // Ustaw maksymalny wiek
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleEdit = (cultivation) => {        
        setEditMode(true);
        setSelectedCultivation(cultivation);
        setInputValue(cultivation.area);      
        setSelectedPlot(cultivation.plotId);
        setSearchTerm(cultivation.plantName);
        setSelectedPlant({ plantId:cultivation.plantId, plantName:cultivation.plantName });
        setDateValue(format(cultivation.sowingDate, 'yyyy-MM-dd'));
        fetchPlotsArea();       
        setShow(true);
    };

    const resetForm = () => {
        setInputValue(''); // Resetowanie stanu formularza
        setValidated(false);
        setSelectedPlot(null);
        setSelectedPlant(null);
        setDateValue('');
        setSearchTerm('');// Resetowanie walidacji
    };

    const handleClose = () => {
        setEditMode(false);
        resetForm();
        setShow(false);
    };

    const handleArchive = (cultivation, isArchiving) => {
        archiveHandler(cultivation.cultivationId, isArchiving, archiveCultivation, revalidate);
    };

    const handleDelete = (cultivation) => {
        deleteHandler(cultivation.cultivationId, deleteCultivation, revalidate);
    };

    return (
        <>
            <div style={{ width: '100%' }} className="p-5 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                    <div className={classes.containerTitle} >
                        <p className="display-4">Uprawy</p>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nową uprawę</Button>
                        </div>
                    </div>
                </div>
                <div className={classes.container}>
                <hr></hr>
                    <p className="display-6" style={{marginTop:"1%"} }>Aktualne uprawy</p>
                    <UniversalTable
                        key={JSON.stringify(rows)}
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit} // Funkcja obsługująca edycję
                        onArchive={handleArchive} // Funkcja obsługująca archiwizację
                        onDelete={handleDelete}
                        auth="true"
                        archivalField="archival" // Nazwa pola archiwizacji (dynamiczne)
                        title="Aktualne uprawy"
                    />
                </div>
                <div className={classes.container} style={{ marginTop: "1%" }}>
                    <hr ></hr>
                    <p className="display-6" style={{ marginTop: "1%" }}>Zakończone uprawy</p>
                    <UniversalTable
                        key={JSON.stringify(archivalRows)}
                        columns={columns}
                        rows={archivalRows}
                        title="Zakończone uprawy"
                    />
                </div>
                <Modal show={show} onHide={handleClose} size="md" className={classes.modal} >
                    <Modal.Header closeButton >
                        <Modal.Title className={classes.modalTitle}>
                            {editMode ? 'Edytuj uprawę' : 'Utwórz nową uprawę'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-4"  controlId="plotSelect">
                                <Form.Label column sm={3}>Wybierz działkę</Form.Label>
                                <Col sm={9}>
                                    <Form.Control as="select"
                                        value={selectedPlot ? selectedPlot :  ''}                                       
                                        onChange={handleSelectChange}
                                        required
                                        isInvalid={validated &&!selectedPlot}> 
                                        <option value="" >Wybierz z listy...</option>
                                        {plotsArea.map(plotArea => (
                                            <option key={plotArea.plotId} value={plotArea.plotId}>{plotArea.plotNumber} ({editMode && Number(plotArea.plotId) === Number(selectedCultivation.plotId) ? selectedCultivation.area + plotArea.area : plotArea.area} ha)</option>
                                            
                                    ))}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-4"  controlId="areaInput">
                                <Form.Label column sm={3}>Powierzchnia [ha]</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="number"
                                        value={inputValue ? inputValue:''}
                                        onChange={handleInputChange}
                                        max={editMode && Number(selectedPlot) === Number(selectedCultivation.plotId) ? selectedCultivation.area + maxArea : maxArea} // Ustaw maksymalny wiek
                                    min="0.10"
                                    step="0.10"
                                        required
                                        isInvalid={validated && (editMode && Number(selectedPlot) === Number(selectedCultivation.plotId) ? (inputValue < 0.10 || inputValue > (selectedCultivation.area +  maxArea))  : (inputValue < 0.10 || inputValue >  maxArea ))}
                                        
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Dostępna powierzchnia do uprawy na tej działce to {maxArea} ha.
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="productSelect">
                                <Form.Label column sm={3}>Wybierz rośline</Form.Label>
                                <Col sm={9}>
                                    {/* Pole wyszukiwania */}
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
                            <Form.Group as={Row} className="mb-4" controlId="sowingDate">
                                <Form.Label column sm={3}>Data siewu</Form.Label>
                                <Col sm={9}>
                                <Form.Control
                                    type="date"
                                    value={dateValue}
                                    onChange={(e) => setDateValue(e.target.value)}
                                    required
                                    isInvalid={validated && !dateValue} 
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
            </div>
        </>
    )
}

export default Cultivations;
export async function loader() {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    try {
        const [cultivationsResponse, archivalCultivationsResponse, plantsResponse] = await Promise.all([
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/cultivations?isArchive=false`, { method: 'GET', headers }),
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/cultivations?isArchive=true`, { method: 'GET', headers }),
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/plants`, {method: 'GET', headers})

        ]);
        if (!cultivationsResponse.ok || !archivalCultivationsResponse.ok || !plantsResponse.ok) {
            return {
                isError: true,
                message: "Failed to fetch data",
            };
        }

        const [cultivations, archivalCultivations, plants] = await Promise.all([
            cultivationsResponse.json(),
            archivalCultivationsResponse.json(),
            plantsResponse.json()
        ]);

        return { cultivations, archivalCultivations,plants, isError: false, message: "" };

    } catch (error) {

        return { isError: true, message: "An unexpected error occurred" };
    }
    
}

export async function action({ request, params }) {
    const token = localStorage.getItem("token");
    const data = await request.formData();
    const formObject = Object.fromEntries(data.entries());
    const method = request.method;
    let url = `${process.env.REACT_APP_API_URL}/agrochem/cultivations`;

    if (method === 'PUT') {
        const id = formObject.cultivationId; // Zakładamy, że ID jest w formularzu
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
       
        return json({ status: 'error', message: response.message }, { status: response.status });
    }

    return json({ status: 'success', message: result.message }, { status: 200 });
}

export async function archiveCultivation(cultivationId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_API_URL}/agrochem/cultivations/archive/${cultivationId}?archive=${isArchiving}`;  
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
        return { status: 'error', message: 'Nie udało się przeprowadzić operacji.' };
    }
}

export async function deleteCultivation(cultivationId) {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_API_URL}/agrochem/cultivations/delete/${cultivationId}`;

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
        return { status: 'error', message: 'Nie udało się przeprowadzić operacji.' };
    }
}
