import { Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState, useEffect } from 'react';
import classes from './MainNavigation.module.css';
import { isAdmin } from '../utils/authUtil';
import Notifications from '../components/Notifications';

function MainNavigation() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [hasNotifications, setHasNotifications] = useState(false);

    // Funkcja do sprawdzania statusu powiadomień
    const checkNotificationsStatus = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch('https://localhost:44311/agrochem/notifications/status',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
                }
            });
        if (response.ok) {
            const status = await response.json();
            setHasNotifications(status); // Ustaw stan na podstawie odpowiedzi
        }
    };

    useEffect(() => {
        checkNotificationsStatus(); // Sprawdź status powiadomień przy załadowaniu
    }, []);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user'); // Możesz tu trzymać np. imię/nazwisko lub email
        
        if (loggedInUser) {
            setUser(loggedInUser); // Ustaw użytkownika jeśli jest zalogowany
           
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Usuń token JWT
        localStorage.removeItem('user');  // Usuń informacje o użytkowniku
        localStorage.removeItem('role');
        setUser(null); // Zresetuj stan użytkownika
        navigate('/login'); // Przekierowanie do strony logowania
    };

    return (
        <>
            {hasNotifications && <Notifications />}
            <Navbar collapseOnSelect expand="lg"   className={classes.nav} >
                <Container >
                <Navbar.Brand href="/">AGROCHEM</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    
                    </Nav>
                        <Nav>
                            {user ? (
                                isAdmin() ?
                                    (<>
                                        <NavDropdown title="Zarządzaj" id="collapsible-nav-dropdown">
                                            <Nav.Link  href="/plants">Rośliny</Nav.Link>
                                            <Nav.Link  href="/diseases">Choroby roślin</Nav.Link>
                                            <Nav.Link  href="/chemicalagents">Środki chemiczne</Nav.Link>
                                            <Nav.Link href="/users">Użytkownicy</Nav.Link>
                                        </NavDropdown>


                                        <Nav.Link style={{ float: 'rigth' }} href="/">Witaj, {user}!</Nav.Link>
                                        <Nav.Link style={{ float: 'rigth' }} onClick={handleLogout}>Wyloguj</Nav.Link>
                                    </>) 
                                    :
                                    (<>
                                        <NavDropdown title="Zarządzaj" id="collapsible-nav-dropdown">
                                            <Nav.Link href="/plots">Działki</Nav.Link>
                                            <Nav.Link href="/cultivations">Uprawy</Nav.Link>
                                            <Nav.Link href="/chemicaltreatment">Zabiegi chemiczne</Nav.Link>
                                            <Nav.Link href="/calculator">Kalulator oprysku</Nav.Link>
                                        </NavDropdown>

                                        <NavDropdown title="Informacje" id="collapsible-nav-dropdown">
                                            <Nav.Link  href="/chemicalagents">Środki chemiczne</Nav.Link>
                                            <Nav.Link  href="/diseases">Choroby roślin</Nav.Link>
                                            <Nav.Link  href="/plants">Rośliny</Nav.Link>
                                        </NavDropdown>
                                        <Nav.Link href="/notifications">Powiadomienia</Nav.Link>
                                        <Nav.Link style={{ float: 'rigth' }} href="/">Witaj, {user}!</Nav.Link>
                                        <Nav.Link style={{ float: 'rigth' }} onClick={handleLogout}>Wyloguj</Nav.Link>
                                    </>)
                                   
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