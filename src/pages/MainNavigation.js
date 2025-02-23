import { Outlet, useNavigate, useLocation, useNavigation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState, useEffect } from 'react';
import classes from './MainNavigation.module.css';
import { isAdmin } from '../utils/authUtil';
import Notifications from '../components/Notifications';
import LoadingSpinner from './LoadingSpinner.js';

function MainNavigation() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const navigation = useNavigation();

    const [hasNotifications, setHasNotifications] = useState(false);
    const location = useLocation();

 
    const checkNotificationsStatus = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/notifications/status`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                }
            });
        if (response.ok) {
            const status = await response.json();
            setHasNotifications(status); 
        }
    };

    useEffect(() => {
        checkNotificationsStatus(); 
    }, []);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user'); 
        
        if (loggedInUser) {
            setUser(loggedInUser); 
           
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');  
        localStorage.removeItem('role');
        setUser(null); 
        navigate('/login'); 
    };

    return (
        <>
            {location.pathname !== "/notifications" &&hasNotifications && <Notifications />}
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
                {navigation.state === 'loading' && <LoadingSpinner /> }
                <Outlet />
            </main>
        </>
    );
}

export default MainNavigation;