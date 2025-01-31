import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useParams, useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const ResetPassword = () => {

    const { token } = useParams();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setNewPassword(value);

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

        if (value !== newPassword) {
            setPasswordMatchError("Hasła muszą być zgodne.");
        } else {
            setPasswordMatchError("");
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;    

        if (form.checkValidity() === false) {
            event.stopPropagation();

        } else {
            console.log(newPassword);
            const response = await fetch("https://localhost:44311/agrochem/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword })
            });

            const result = await response.text();
            if (response.ok) {                
                MySwal.fire({
                    title: 'Sukces!',
                    text: result.message,
                    icon: 'success',
                    confirmButtonText: "Przejdź do logowania"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login");
                    }
                });
            } else {

                MySwal.fire({
                    title: 'Błąd!',
                    text: result.message,
                    icon: 'error',
                    confirmButtonText: "Spróbuj ponownie"
                });
            }           
        }
    };

    return (
        <>
        <Card style={{ width: "40%", marginTop: "1%", marginLeft: "auto", marginRight: "auto", marginBottom: "5%" }}>
            <Card.Img variant="top" src="/registrationimage.jpg" />
            <Card.Body style={{ textAlign: "center" }}>
                <Card.Title >Resetowanie hasłą</Card.Title>
                <Card.Text>
                    Podaj nowe hasło do aplkacji.
                </Card.Text>
            </Card.Body>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                

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

                <Form.Group as={Row} className="mb-3" controlId="password2" >
                    <Form.Label column sm={3}>
                        Powtórz hasło
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="password" placeholder="Hasło" required name="password2" onChange={handleConfirmPasswordChange} />
                        <Form.Control.Feedback></Form.Control.Feedback>
                        {passwordMatchError && <p style={{ color: "red" }}>{passwordMatchError}</p>}
                    </Col>
                </Form.Group>
                
                <Button type="submit">ZAPISZ</Button>
            </Form>

        </Card>
        </>
        
    );
};

export default ResetPassword;
