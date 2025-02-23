
import classes from './ChemicalAgents.module.css';
import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator } from 'react-router-dom';
import UniversalTable from '../components/Table';
import { Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import useActionEffect from '../hooks/useActionEffect';
import archiveHandler from '../utils/ArchiveHandler';
import Swal from 'sweetalert2';
import { isAdmin } from '../utils/authUtil';

function ChemicalAgent() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedChemAgent, setSelectedChemAgent] = useState(null);
    const data = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const { revalidate } = useRevalidator();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [preview, setPreview] = useState(null);
    const [photo, setPhoto] = useState();

    useActionEffect(actionData, revalidate, setShow);

    useEffect(() => {
        if (data && Array.isArray(data)) {           
            const mappedRows = data.map((item) => ({
                id: item.chemAgentId,
                name: item.name,
                type: item.type,
                description: item.description,
                originalData: item,
                details: (
                    <IconButton
                        onClick={() => navigate(`/chemicalagents/${item.chemAgentId}`)} 
                        color="primary"
                    >
                        <Visibility />
                    </IconButton>)
            }));

            setRows(mappedRows); 
        }
    }, [data, navigate]);
    const columns = [
        { field: 'name', headerName: 'Nazwa', minWidth: 200, headerAlign: 'center' },
        { field: 'type', headerName: 'Typ',  minWidth: 200, headerAlign: 'center' },
        { field: 'description', headerName: 'Opis', flex: 1, minWidth: 200, headerAlign: 'center' },
        { field: "details", headerName: "Szczegóły",  minWidth: 100, headerAlign: 'center' },

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
            const formData = new FormData(form);
            const token = localStorage.getItem("token");

            let url = `${process.env.REACT_APP_API_URL}/agrochem/chemicalagents`;
            let method = "POST";

            if (editMode) {
                url = `${url}/${selectedChemAgent.chemAgentId}`;
                method = "PUT";
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        // 'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: formData,
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
                Swal.fire({
                    icon: 'error',
                    title: 'Błąd',
                    text: error,
                }).then(() => {

                    setShow(false);
                });

            }
            handleClose();
        }
    };


    const handleEdit = (chemAgent) => {
        setEditMode(true);
        setSelectedChemAgent(chemAgent);
        setPreview(chemAgent.photo);
        setShow(true);
    };

    const handleClose = () => {
        setEditMode(false);
        setSelectedChemAgent(null);
        setPreview(null);
        setShow(false);
    };

    const handleArchive = (chemAgent, isArchiving) => {
        archiveHandler(chemAgent.chemAgentId, isArchiving, archiveChemAgnet, revalidate);
    };

    const handleFileChange = (e) => {

        const photo = e.target.files[0];
        if (photo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);  
            };
            reader.readAsDataURL(photo);
            setPhoto(photo); 
        }
    };
 

    return (
        <>
            <div style={{ width: '100%' }} className="p-3 text-center bg-body-tertiary ">
                <div className={classes.containerTop} >
                    <div className={classes.containerTitle} >
                        <p className="display-4"><b>Środki chemiczne</b></p>
                </div>
                <div class="row">
                    <div className="col d-flex justify-content-end">
                            {isAdmin() && <Button variant="danger" size="lg" onClick={handleShow}>Dodaj nowy środek chemiczny</Button>}
                        </div>
                    </div>
                </div>
                <div className={classes.container}>
                    <UniversalTable
                        key={JSON.stringify(rows)}
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit} 
                        onArchive={handleArchive} 
                        auth={isAdmin()}
                        archivalField="archival" 
                        titlr="Środki chemiczne"
                    />
                </div>
                <Modal show={show} onHide={handleClose} size="md" className={classes.modal} >
                    <Modal.Header closeButton >
                        <Modal.Title className={classes.modalTitle}>
                            {editMode ? 'Edytuj środek' : 'Utwórz nowy środek chemiczny'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} method={editMode ? 'PUT' : 'POST'} onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-4" controlId="Name">
                                <Form.Label column sm={3}>
                                    Nazwa środka
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nazwa"
                                        required name="Name"
                                        defaultValue={editMode && selectedChemAgent ? selectedChemAgent.name : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Type">
                                <Form.Label column sm={3}>
                                    Typ środka
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Typ"
                                        required name="Type"
                                        defaultValue={editMode && selectedChemAgent ? selectedChemAgent.type : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="Description">
                                <Form.Label column sm={3}>
                                    Opis środka
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        as="textarea"
                                        maxLength={2000} 
                                        rows={5}
                                        placeholder="Opis (max 2 000 znaków)"
                                        required name="Description"
                                        defaultValue={editMode && selectedChemAgent ? selectedChemAgent.description : ''}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-4" controlId="File">
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
                                        <p style={{ float: "left" }}>Obecny obraz:</p>
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

export default ChemicalAgent;
export async function loader() {
    const token = localStorage.getItem("token");
    let archive="false"
    if (isAdmin()) {
        archive = "true";
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/chemicalagents?isArchive=${archive}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  
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
    const method = request.method;
    let url = `${process.env.REACT_APP_API_URL}/agrochem/chemicalagents`;

    if (method === 'PUT') {
        const id = formObject.id; 
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
        return json({ status: 'error', message: error.message }); 

    }
}

export async function archiveChemAgnet(chemAgenId, isArchiving) {
    const token = localStorage.getItem("token");

    const url = `${process.env.REACT_APP_API_URL}/agrochem/chemicalagents/archive/${chemAgenId}?archive=${isArchiving}`;
   
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
        return { status: 'error', message: 'Nie udało się przeprowadzić operacji dla tej rośliny.' };
    }
}
