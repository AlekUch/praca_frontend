import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Cultivations.module.css';
import { useState, useEffect } from 'react';
import { Form, Row, Col, Dropdown, Button, Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { format } from 'date-fns';

const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">{message}</Tooltip>
);

const MySwal = withReactContent(Swal);

function Cultivations() {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [selectedCultivation, setSelectedCultivation] = useState(null);
    const data = useLoaderData();

    const { cultivations, plants } = data;
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const [plotsArea, setPlotsArea] = useState([]); // Użytkownicy
    const [maxArea, setMaxArea] = useState(0); // Maksymalny wiek
    const [inputValue, setInputValue] = useState(''); // Wartość inputu
    const [dateValue, setDateValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlants, setFilteredPlants] = useState(plants);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Filtrowanie produktów
    useEffect(() => {

        if (Array.isArray(plants)) {
            const filtered = plants.filter(plant =>
                plant.name && plant.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setFilteredPlants(filtered);
        }
    }, [searchTerm, plants]);

    // Obsługa pola wyszukiwania
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
    };

    // Obsługa wyboru produktu
    const handleSelectPlant = (plant) => {
        setSelectedPlant(plant);
        setSearchTerm(plant.name); // Ustaw nazwę w polu tekstowym
        setShowDropdown(false); // Zamknięcie dropdownu
    };
    // Funkcja do pobierania użytkowników z backendu
    const fetchPlotsArea = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://localhost:44311/agrochem/plots/plotsArea`, {
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

    const handleShow = () => {
        setShow(true);
        fetchPlotsArea();
    };

    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;       
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            
            if (editMode) {
                // Prześlij żądanie PUT
                const dataToSend = {
                    area: inputValue,
                    sowingDate: dateValue,
                    plotId: selectedPlot,
                    plantId: Number(selectedPlant.plantId),
                    cultivationId: selectedCultivation.cultivationId
                };
                submit(dataToSend, { method: 'PUT' });
            } else {
                // Prześlij żądanie POST
                const dataToSend = {
                    area: inputValue,
                    sowingDate: dateValue,
                    plotId: selectedPlot,
                    plantId: selectedPlant.plantId
                };
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
        // Resetuj wartość inputu
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
        Swal.fire({
            title: `Czy na pewno chcesz zakończyć tą uprawę?`,
            text: ` 'Po zakończeniu edycja i usunięcie tej uprawy nie będzie możliwe!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Zarchiwizuj!`,
            cancelButtonText: 'Anuluj'
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await archiveCultivation(cultivation.cultivationId, isArchiving);

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

    const handleDelete = (cultivation) => {
        Swal.fire({
            title: `Czy na pewno chcesz usunąć tą uprawę?`,
            text: ` 'Po usunięciu uprawy będzie ona niedostępna!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Usuń!`,
            cancelButtonText: 'Anuluj'
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await deleteCultivation(cultivation.cultivationId);

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
                <p className="display-4">Aktualne uprawy</p>
                <div class="row">
                    <div className="col d-flex justify-content-end">
                        <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nową uprawę</Button>
                    </div>
                </div>
                <div className={classes.container}>
                    <Table responsive >
                        <thead >
                            <tr >
                                <th>Numer działki</th>
                                <th>Uprawiana roślina</th>
                                <th>Powierzchnia [ha]</th>
                                <th>Data siewu</th>
                                
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            {cultivations.map(cultivation => (
                                <tr key={cultivation.cultivationId}>
                                    <td>{cultivation.plotNumber}</td>
                                    <td>{cultivation.plantName}</td>
                                    <td>{cultivation.area} ha</td>
                                    <td>{new Date(cultivation.sowingDate).toLocaleDateString("pl-PL")} </td>                                   
                                    
                                        <>
                                            <td>
                                               
                                            {!cultivation.archival ? (
                                                <>
                                                    
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={renderTooltip('Edytuj')}
                                                        >
                                                            <i
                                                                className="bi bi-pencil-square"
                                                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                                                onClick={() => handleEdit(cultivation)}
                                                            />
                                                        </OverlayTrigger>


                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={renderTooltip('Zakończ uprawę')}
                                                        >
                                                            <i
                                                                className="bi bi-archive"
                                                                style={{ cursor: 'pointer', color: 'red' }}
                                                                onClick={() => handleArchive(cultivation, true)}
                                                            />
                                                        </OverlayTrigger>

                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={renderTooltip('Usuń')}
                                                        >
                                                            <i
                                                                className="bi bi-trash"
                                                                style={{ cursor: 'pointer', color: 'red' }}
                                                                onClick={() => handleDelete(cultivation)}
                                                            />
                                                        </OverlayTrigger>
                                                    
                                                </>
                                            ) : (
                                                    <>
                                                       
                                                    </>
                                            )}

                                                
                                            </td>
                                        </>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
                            <Form.Group as={Row} className="mb-4" controlId="sowingDate">
                                <Form.Label column sm={3}>Data siewu</Form.Label>
                                <Col sm={9}>
                                <Form.Control
                                    type="date"
                                    value={dateValue}
                                    onChange={(e) => setDateValue(e.target.value)}
                                    required
                                    isInvalid={validated && !dateValue} // Walidacja, aby sprawdzić, czy data jest wybrana
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
    const response = await fetch(`https://localhost:44311/agrochem/cultivations`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
        }
    });
    if (!response.ok) {
        console.log(response);
       // const result = await response.json();
        return { isError: true, message: response.message }
    } else {
        console.log(response);
        return await response.json();
       
    }
}

export async function action({ request, params }) {
    const token = localStorage.getItem("token");
    const data = await request.formData();
    //console.log(data);
    const formObject = Object.fromEntries(data.entries());
    console.log(formObject);
    const method = request.method;
   
    // URL bazowy
    let url = 'https://localhost:44311/agrochem/cultivations';

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
        console.log(response);
        return json({ status: 'error', message: response.message }, { status: response.status });
    }

    return json({ status: 'success', message: result.message }, { status: 200 });
}

export async function archiveCultivation(cultivationId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `https://localhost:44311/agrochem/cultivations/archive/${cultivationId}?archive=${isArchiving}`;
    
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
    const url = `https://localhost:44311/agrochem/cultivations/delete/${cultivationId}`;

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
///respons ok, error message -> useActionData
//