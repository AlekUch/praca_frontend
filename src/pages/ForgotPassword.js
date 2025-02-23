import { useState } from "react";
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const ForgotPassword = () => {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/reset-link`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        MySwal.fire({
            title: 'Informacja!',
            text: result.message,
            icon: 'info',
            confirmButtonText: "OK"
        }).then((result) => {
            navigate("/");
        });
    };

    return (
        <Card style={{ width: "40%", marginTop: "1%", marginLeft: "auto", marginRight: "auto", marginBottom: "5%" }}>
            <Card.Img variant="top" src="/registrationimage.jpg" />
            <Card.Body style={{ textAlign: "center" }}>
                <Card.Title >Odzyskiwanie hasła</Card.Title>
                <Card.Text>
                <p>Podaj email, na który ma być wysłany link do zmiany hasła.</p>
                    <Form  onSubmit={handleSubmit}>

                        <Form.Group as={Row} className="mb-3" controlId="email">
                            <Form.Label column sm={3}>
                                Email
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="email"
                                    placeholder="Podaj email"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    required name="email" />
                                <Form.Control.Feedback type="invalid">
                                    Niepoprawny email.
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>                       
            <Button style={{ marginLeft: "5%", marginRight: "5%" }} type="submit">Wyślij</Button>
                    </Form>
                </Card.Text>
            </Card.Body>
        </Card>

    );
};

export default ForgotPassword;
