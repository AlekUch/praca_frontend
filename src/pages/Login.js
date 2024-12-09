import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const MySwal = withReactContent(Swal);

function Login() {
    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);

        if (value.length < 8) {
            setPasswordError("Hasło musi mieć co najmniej 8 znaków.");
        } else {
            setPasswordError("");
        }

    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            console.log("Formularz nie jest poprawny.");
        } else {
            const formData = new FormData(form);

            try {
                const response = await fetch('https://localhost:44311/agrochem/login', {
                    method: 'POST',
                    headers: {

                    },
                    body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', result.user);
                    const decodedToken = jwtDecode(result.token); // Dekoduj token
                    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    localStorage.setItem('role', role);
                    console.log(role);
                    MySwal.fire({
                        title: 'Sukces!',
                        text: "Zalogowano pomyślnie",
                        icon: 'success',
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/"; // Użycie navigate do przekierowania
                        }

                    });
                } else {
                    console.log(result.message);
                    MySwal.fire({
                        title: 'Błąd!',
                        text: result.message,
                        icon: 'error',
                        confirmButtonText: "Spróbuj ponownie"
                    });
                }

            } catch (error) {
                console.log(error.message);
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
            <Card style={{ width: "40%", marginTop: "1%", marginLeft: "auto", marginRight: "auto", marginBottom: "5%" }}>
                <Card.Img variant="top" src="/registrationimage.jpg" />
                <Card.Body style={{ textAlign: "center" }}>
                    <Card.Title >Logowanie</Card.Title>
                    <Card.Text>
                        Zaloguj się by mieć dostęp do tej aplikacji.
                    </Card.Text>
                </Card.Body>

                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                    <Form.Group as={Row} className="mb-3" controlId="email">
                        <Form.Label column sm={3}>
                            Email
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="email" placeholder="Email" required name="email" />
                            <Form.Control.Feedback></Form.Control.Feedback>
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
                                <Form.Control type="password" placeholder="Hasło" required name="password" onChange={handlePasswordChange} />
                                <Form.Control.Feedback></Form.Control.Feedback>
                                {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                        
                        </Col>
                    </Form.Group>

             
                    <Card.Body style={{ textAlign: "center" }}>

                        <Card.Text>
                            Nie masz konta? <Link to="/registration">Zarejestruj się</Link>
                        </Card.Text>
                    </Card.Body>
                    <Button type="submit">ZALOGUJ</Button>
                
                </Form>

            </Card>
        </>
    );
}

export default Login;