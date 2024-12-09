import { Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState, useEffect } from 'react';
import classes from './MainNavigation.module.css';
function MainNavigation() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user'); // Możesz tu trzymać np. imię/nazwisko lub email
        console.log(loggedInUser);
        if (loggedInUser) {
            setUser(loggedInUser); // Ustaw użytkownika jeśli jest zalogowany
            setRole(localStorage.getItem('role'));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Usuń token JWT
        localStorage.removeItem('user');  // Usuń informacje o użytkowniku
        localStorage.removeItem('role');
        setUser(null); // Zresetuj stan użytkownika
        setRole(null);
        navigate('/login'); // Przekierowanie do strony logowania
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg"   className={classes.nav} >
                <Container >
                <Navbar.Brand href="#home">AGROCHEM</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    {/*    <Nav.Link href="#features">Features</Nav.Link>*/}
                    {/*    <Nav.Link href="#pricing">Pricing</Nav.Link>*/}
                    {/*    <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">*/}
                    {/*        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.2">*/}
                    {/*            Another action*/}
                    {/*        </NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Divider />*/}
                    {/*        <NavDropdown.Item href="#action/3.4">*/}
                    {/*            Separated link*/}
                    {/*        </NavDropdown.Item>*/}
                    {/*    </NavDropdown>*/}
                    </Nav>
                        <Nav>
                            {user ? (
                                <>
                                    {role === 'Admin' ? (
                                        <>
                                        <Nav.Link style={{ float: 'left' }} href="/plants">Rośliny</Nav.Link>
                                            <Nav.Link style={{ float: 'left' }} href="/chemicalagents">Środki chemiczne</Nav.Link>
                                        </>
                                    ) :
                                        <>
                                            <Nav.Link style={{ float: 'left' }} href="/plots">Działki</Nav.Link>
                                            <Nav.Link style={{ float: 'left' }} href="/cultivations">Uprawy</Nav.Link>
                                       </>
                                    }

                                    <Nav.Link style={{ float: 'rigth' }} href="/">Witaj, {user}!</Nav.Link> {/* Wyświetla nazwę użytkownika */}
                                    <Nav.Link style={{ float: 'rigth' }} onClick={handleLogout}>Wyloguj</Nav.Link>
                                </>
                            ) : (
                                <>
                                        <Nav.Link style={{ float: 'right' }} href="/registration">Zarejestruj</Nav.Link>
                                        <Nav.Link style={{ float: 'right' }} eventKey={2} href="/login"> Zaloguj</Nav.Link>
                                </>
                            )}
                            
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
            <main>
                {navigate.state==='loading' && <p>Ładowanie strony...</p> }
                <Outlet />
            </main>
        </>
    );
}

export default MainNavigation;