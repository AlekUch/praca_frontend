import { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import './Registration.module.css';
import { Link, useNavigate } from "react-router-dom";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

function Registration() {
    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

     const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);

        if (value.length < 8) {
            setPasswordError("Hasło musi mieć co najmniej 8 znaków.");
        } else {
            setPasswordError("");
        }


        if (confirmPassword && value !== confirmPassword) {
            setPasswordMatchError("Hasła muszą być zgodne.");
        } else {
            setPasswordMatchError("");
        }
    };

    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        setConfirmPassword(value);

        if (value !== password) {
            setPasswordMatchError("Hasła muszą być zgodne.");
        } else {
            setPasswordMatchError("");
        }
    };
        
    const handleSubmit = async(event) => {
        event.preventDefault();

        const form = event.currentTarget;    

        if (form.checkValidity() === false) {           
            event.stopPropagation();
           
        }else{
            const formData = new FormData(form);
            
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/register`, {
                  method: 'POST',
                  headers: {
                    
                  },
                body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    
                    MySwal.fire({
                        title: 'Sukces!',
                        text: result.message,
                        icon: 'success',
                        confirmButtonText:"OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/'); 
                        }

                    });
                } else {
                   
                    MySwal.fire({
                        title: 'Błąd!',
                        text: result.message,
                        icon: 'error',
                        confirmButtonText:"Spróbuj ponownie"                   
                    });
                }
               
            } catch (error) {
               
                MySwal.fire({
                    title: 'Błąd!',
                    text: 'Nieoczekiwany błąd serwera',
                    icon: 'error',
                    confirmButtonText: 'Spróbuj ponownie'
                });
            }
        }
         
        setValidated(true);
    };

    return (
        <>
            <Card style={{width: "40%",marginTop: "1%",marginLeft:"auto",marginRight:"auto",marginBottom:"5%"}}>
            <Card.Img variant="top" src="/registrationimage.jpg" />
                <Card.Body style={{ textAlign: "center" }}>
                    <Card.Title >Rejestracja</Card.Title>
                <Card.Text>
                    Zarejestruj się by móc w pełni korzystać z tej aplikacji.
                </Card.Text>
                </Card.Body>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="firstname">
                        <Form.Label column sm={3}>
                            Imię
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" placeholder="Imię" required name="firstname" />
                            <Form.Control.Feedback></Form.Control.Feedback>
                            
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="lastname">
                        <Form.Label column sm={3}>
                            Nazwisko
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" placeholder="Nazwisko" required name="lastname"/>
                            <Form.Control.Feedback></Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="email">
                        <Form.Label column sm={3}>
                            Email
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="email" placeholder="Email" required name="email"/>
                            <Form.Control.Feedback type="invalid">
                                Niepoprawny email.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="password">
                        <Form.Label column sm={3}>
                            Hasło
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="password" placeholder="Hasło" required name="password" onChange={handlePasswordChange}/>
                            <Form.Control.Feedback></Form.Control.Feedback>
                            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="password2" >
                        <Form.Label column sm={3}>
                            Powtórz hasło
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="password" placeholder="Hasło" required name="password2" onChange={handleConfirmPasswordChange}/>
                            <Form.Control.Feedback></Form.Control.Feedback>
                            {passwordMatchError && <p style={{ color: "red" }}>{passwordMatchError}</p>}
                        </Col>
                    </Form.Group>
                    <Card.Body style={{ textAlign: "center" }}>

                        <Card.Text>
                            Masz już utworzone konto? <Link to="/login">Zaloguj się</Link>
                        </Card.Text>
                    </Card.Body>
            <Button type="submit">ZAREJESTRUJ SIĘ</Button>
             {responseMessage && <p>{responseMessage}</p>}
                </Form>
                
        </Card>
        </>
    );
}

export default Registration;