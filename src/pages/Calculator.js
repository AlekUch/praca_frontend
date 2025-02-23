
import classes from './Calculator.module.css';
import { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import { useLoaderData, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import useActionEffect from '../hooks/useActionEffect';
import ScienceIcon from "@mui/icons-material/Science";
import OpacityIcon from "@mui/icons-material/Opacity";

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
    const [calculatedDose, setCalculatedDose] = useState(null);
    const [calculatedWater, setCalculatedWater] = useState(null);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [area, setArea] = useState("");
    const [dose, setDose] = useState("");
    const [water, setWater] = useState("");

    useActionEffect(actionData, revalidate, setShow);


    const fetchChemAgents = async (plantId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/chemicaluse/plant/${plantId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  
                }
            });
            if (!response.ok) {
                const result = await response.json();
                return { isError: true, message: result.message }
            } else {
                const result = await response.json();
                setChemUse(result);
            }
        } catch (error) {
            console.error('Błąd pobierania roślin:', error);
        }
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
            let doseVal = (dose * area).toFixed(2);
            let waterVal = (water * area).toFixed(2);
            setCalculatedDose(doseVal);
            setCalculatedWater(waterVal);
        }
    };



    const handleSelectChange = (e) => {
        setCalculatedDose(null);
        const plotId = e.target.value;
        const plot = plots.find((plot) => plot.plotId === parseInt(plotId)); 
        setSelectedPlot(plot); 
        setArea(plot.area);
    };

    const handlePlantChange = async (e) => {
        setCalculatedDose(null);
        const plantId = e.target.value;
        setSelectedPlant(plantId); 
        await fetchChemAgents(plantId);
    };

    const handleChemUseChange = (e) => {
        setCalculatedDose(null);
        const chemUseId = e.target.value;
        const selected = chemUse.find(
            (chemUse) => chemUse.chemUseId === parseInt(chemUseId)
        );
        setSelectedChemUse(selected);

    };

    return (
        <>
            <div style={{ width: '100%' }} className="p-5 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                    <div className={classes.containerTitle} >
                        <p className="display-4">Kalkulator zastosowania środka</p>
                    </div>
                    <div className="row">
                       
                    </div>
                </div>
                <div className={classes.container}>
                <div className="row">
                    <div class="col-8" >
                        <Card className="text-center" style={{ minHeight: "100px", margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                            <Card.Title style={{ fontSize: "25px", float: "center", paddingTop:"3%" }}><b>Wprowadź dane</b></Card.Title>
                            <Card.Body style={{ borderRadius: '10px' }}>
                                <Card.Text className={classes.cardText}>

                                        <Form noValidate validated={validated} method='POST' onSubmit={handleSubmit} style={{ fontSize:"20px" }}>
                                        <Form.Group as={Row} className="mb-4" controlId="area">
                                            <Form.Label column sm={3}>Wybierz działkę</Form.Label>
                                            <Col sm={9}>
                                                    <Form.Control as="select"
                                                        style={{ fontSize: "20px" }}
                                                    value={selectedPlot ? selectedPlot.plotId : ''}
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
                    
                                        <Form.Group as={Row} className="mb-4" controlId="plant">
                                            <Form.Label column sm={3}>Wybierz roślinę</Form.Label>
                                            <Col sm={9}>
                                                    <Form.Control as="select"
                                                        style={{ fontSize: "20px" }}
                                                    value={selectedPlant ? selectedPlant : ''}
                                                    onChange={handlePlantChange}
                                                    name="plant"
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
                                                <Form.Group as={Row} className="mb-4" controlId="chemAgent">
                                                    <Form.Label column sm={3}>Wybierz środek chemiczny</Form.Label>
                                                    <Col sm={9}>
                                                        <Form.Control as="select"
                                                            style={{ fontSize: "20px" }}
                                                        value={selectedChemUse ? selectedChemUse.chemUseId : ''}
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

                                        {(selectedChemUse ) &&
                                            (
                                                <Form.Group as={Row} className="mb-4" controlId="dose">
                                                <Form.Label column sm={3}>Wybierz ilość środka ({selectedChemUse.minDose}l - {selectedChemUse.maxDose}l)</Form.Label>
                                                    <Col sm={9}>
                                                        <Form.Control
                                                            style={{ fontSize: "20px" }}
                                                        type="number"
                                                            value={dose}
                                                        required
                                                        name="dose" onChange={(e) => setDose(e.target.value)}
                                                        isInvalid={validated && (dose > selectedChemUse.maxDose || dose < selectedChemUse.minDose)}
                                                        min={selectedChemUse.minDose}
                                                        max={selectedChemUse.maxDose}
                                                        step="0.10"
                                                       >
                                                    </Form.Control>
                                                    <Form.Control.Feedback type="invalid">
                                                        Wybrana dawka środka musi byc mniejsza od maksymalnej dawki i większa od mninimalnej dawki dla tego środka.
                                                    </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            )
                                        }
                                        {(selectedChemUse) &&
                                            (
                                                <Form.Group as={Row} className="mb-4" controlId="water">
                                                    <Form.Label column sm={3}>Wybierz ilość wody ({selectedChemUse.minWater}l - {selectedChemUse.maxWater}l)npm</Form.Label>
                                                    <Col sm={9}>
                                                        <Form.Control
                                                            style={{ fontSize: "20px" }}
                                                            type="number"
                                                            value={water}
                                                        required
                                                        name="water"
                                                        onChange={(e) => setWater(e.target.value)}
                                                            isInvalid={validated && (water > selectedChemUse.maxWater || water < selectedChemUse.minWater)}
                                                            min={selectedChemUse.minWater}
                                                            max={selectedChemUse.maxWater}
                                                            step="0.10"
                                                        >
                                                        </Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            Wybrana dawka wody musi byc mniejsza od maksymalnej dawki wody i większa od mninimalnej dawki wody dla tego środka.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            )
                                        }
                        
                                        <Form.Group as={Row} className="mb-3" >
                                            <Button className={classes.savePlotButton} type="submit">PRZELICZ</Button>
                            
                                        </Form.Group>
                                    </Form>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    
                    </div>
                        <div class="col-4" >
                            <Card className="text-center" style={{ fontSize: "20px", minHeight: "100px", margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden', backgroundColor: calculatedDose ? "#bdeefd" : "white" }}>
                            <Card.Title style={{ fontSize: "25px", float: "center", paddingTop: "3%" }}><b>Wynik</b></Card.Title>
                            <Card.Body style={{ borderRadius: '10px' }}>
                                <Card.Text className={classes.cardText}>
                                    {calculatedDose && calculatedWater
                                            ?
                                                <>
                                                    <p> Dla wprowadzonych danych należy użyć:</p>
                                                <p> <ScienceIcon style={{ fontSize: 35, color: "green" }} /> <b>{calculatedDose}l</b> środka {selectedChemUse.chemAgentName}</p>
                                                <p><OpacityIcon style={{ fontSize: 35, color: "blue" }} /> <b>{calculatedWater}l</b> wody </p>
                                                       
                                                </>
                                        :<p> Wynik uzyskasz po wprowadzeniu i zatwierdzeniu wszystkich danych.</p>
                                        }
                                    
                                </Card.Text>

                            </Card.Body>
                        </Card>
                        </div>
                    </div>
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
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/plots?isArchive=false`, { method: 'GET', headers }),
            fetch(`${process.env.REACT_APP_API_URL}/agrochem/plants`, { method: 'GET', headers })
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