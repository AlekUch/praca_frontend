import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Calculator.module.css';
import { useState, useEffect } from 'react';
import { Form, Row, Col, Dropdown, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import { format } from 'date-fns';
import useActionEffect from '../hooks/useActionEffect';

function Calculator() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [selectedChemUse, setSelectedChemUse] = useState(null);
    const { plots, plants,  isError, message } = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const [chemUse, setChemUse] = useState([]);
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


    const handleSelectPlant = (plant) => {
        setSelectedPlant(plant);
        setSearchTerm(plant.name);
        setShowDropdown(false);
    };

    const fetchChemAgents = async (plantId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://localhost:44311/agrochem/chemicaluse/plant/${plantId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Przekazujemy token w nag³ówku
                }
            });
            if (!response.ok) {
                const result = await response.json();
                return { isError: true, message: result.message }
            } else {
                const result = await response.json();
                setChemUse(result);
                console.log(result);
            }
        } catch (error) {
            console.error('B³¹d pobierania dzia³ek:', error);
        }
    };


    if (isError) {
        return <p>B³¹d: {message}</p>;
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
            

                submit(dataToSend, { method: 'POST' });
            

        }
    };

    const resetForm = () => {
        //setInputValue(''); // Resetowanie stanu formularza
        //setValidated(false);
        //setSelectedPlot(null);
        //setSelectedPlant(null);
        //setDateValue('');
        //setSearchTerm('');// Resetowanie walidacji
    };

    const handleSelectChange = (e) => {
        const plotId = e.target.value;
        const plot = plots.find(plot => plot.plotId === plotId); // ZnajdŸ u¿ytkownika po ID
        setSelectedPlot(plotId); // Ustaw ID wybranego u¿ytkownika
        setMaxArea(plot ? plot.area : 0); // Ustaw maksymalny wiek
    };

    const handlePlantChange = async (e) => {
        const plantId = e.target.value;
        setSelectedPlant(plantId); // Ustaw ID wybranego u¿ytkownika
        await fetchChemAgents(plantId);
    };

    const handleChemUseChange = (e) => {
        const chemUseId = e.target.value;
        setSelectedChemUse(chemUseId); // Ustaw ID wybranego u¿ytkownika
        console.log(chemUseId);
    };

    return (
        <>
            <div style={{ width: '100%' }} className="p-5 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                    <div className={classes.containerTitle} >
                        <p className="display-4">Kalkulator zastosowania œrodka</p>
                    </div>
                    <div className="row">
                       
                    </div>
                </div>
                <div className={classes.container}>
                    <Form noValidate validated={validated} method='POST' onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-4" controlId="areaInput">
                            <Form.Label column sm={3}>Wybierz dzia³kê</Form.Label>
                            <Col sm={9}>
                                <Form.Control as="select"
                                    value={selectedPlot ? selectedPlot : ''}
                                    onChange={handleSelectChange}
                                    required
                                    isInvalid={validated && !selectedPlot}>
                                    <option value="" >Wybierz z listy...</option>
                                    {plots.map(plotArea => (
                                        <option key={plotArea.plotId} value={plotArea.plotId}>{plotArea.plotNumber} {plotArea.area}ha</option>

                                    ))}
                                </Form.Control>
                            </Col>
                      
                           </Form.Group>
                    
                        <Form.Group as={Row} className="mb-4" controlId="plotSelect">
                            <Form.Label column sm={3}>Wybierz roœlinê</Form.Label>
                            <Col sm={9}>
                                <Form.Control as="select"
                                    value={selectedPlant ? selectedPlant : ''}
                                    onChange={handlePlantChange}
                                    required
                                    isInvalid={validated && !selectedPlant}>
                                    <option value="" >Wybierz z listy...</option>
                                    {plants.map(plant => (
                                        <option key={plant.plantId} value={plant.plantId}>{plant.name}</option>

                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        
                        {(selectedPlant && selectedPlot) &&
                            (
                                <Form.Group as={Row} className="mb-4" controlId="plotSelect">
                                    <Form.Label column sm={3}>Wybierz œrodek chemiczny</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control as="select"
                                            value={selectedChemUse ? selectedChemUse : ''}
                                            onChange={handleChemUseChange}
                                            required
                                            isInvalid={validated && !selectedChemUse}>
                                            <option value="" >Wybierz z listy...</option>
                                            {chemUse.map(chem => (
                                                <option key={chem.chemUseId} value={chem.chemUseId}>{chem.chemAgentName}</option>

                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                             )
                            }
                        
                        <Form.Group as={Row} className="mb-3" >
                            <Button className={classes.savePlotButton} type="submit">ZAPISZ</Button>
                            
                        </Form.Group>
                    </Form>                   
                </div>                                         
            </div>
        </>
    )
}

export default Calculator;
export async function loader() {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    try {
        const [plotsResponse,  plantsResponse] = await Promise.all([
            fetch(`https://localhost:44311/agrochem/plots?isArchive=false`, { method: 'GET', headers }),
            fetch(`https://localhost:44311/agrochem/plants`, { method: 'GET', headers })
        ]);
        if (!plotsResponse.ok || !plantsResponse.ok ) {
            return {
                isError: true,
                message: "Failed to fetch data",
            };
        }

        const [plots, plants] = await Promise.all([
            plotsResponse.json(),
            plantsResponse.json()
        ]);

        return { plots, plants,  isError: false, message: "" };

    } catch (error) {

        return { isError: true, message: "An unexpected error occurred" };
    }

}