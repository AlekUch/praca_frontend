import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect } from 'react';
import MainNavigation from './pages/MainNavigation';
import RegistrationPage from './pages/Registration';
import LoginPage from './pages/Login';
import PlotsPage, { loader as loaderPlots, action as actionPlot } from './pages/Plots';
import CultivationsPage, { loader as loaderCultivation, action as actionCultivation } from './pages/Cultivations';
import PlantPage, { loader as loaderPlants, action as actionPlants } from './pages/Plant';
import ChemicalAgentPage, { loader as loaderChemAgent, action as actionChemAgent } from './pages/ChemicalAgents';
import ChemAgentDetailsPage, {loader as loaderChemDetails, action as actionChemDetails } from './pages/ChemicalAgentDetails';
import DiseasePage, { loader as loaderDiseases, action as actionDiseases } from './pages/Disease';
import DiseaseDetailsPage, { loader as loaderDiseaseDetails } from './pages/DiseaseDetails';
import ChemicalTreatmentPage, { loader as loaderChemTreatment, action as actionChemTreatment } from './pages/ChemicalTreatment';
import CalculatorPage, { loader as loaderCalculator } from './pages/Calculator.js';
import AccountActivationPage from './pages/AccountActivation.js';
import ForgotPasswordPage from './pages/ForgotPassword.js';
import ResetPasswordPage from './pages/ResetPassword.js';
import NotificationPage, { loader as loaderNotifications } from './pages/NotificationPage';
import UsersPage, { loader as loaderUsers, action as actionUsers } from './pages/Users';
import ErrorPage from './pages/ErrorPage';
import { Spinner } from 'react-bootstrap'; 

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainNavigation />,
        errorElement: <ErrorPage />,
        children: [
            //{ index: true, element: <HomePage /> },
            {
                path: 'registration',
                element: <RegistrationPage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'plots',
                element: <PlotsPage />,
                loader: loaderPlots,
                action: actionPlot
            },
            {
                path: 'cultivations',
                element: <CultivationsPage />,
                loader: loaderCultivation,
                action: actionCultivation
            },
            {
                path: 'plants',
                element: <PlantPage />,
                /*element: localStorage.getItem('role') === 'Admin' ? <PlantPage /> : <LoginPage />,*/
                loader: loaderPlants,
                action: actionPlants
            },
            {
                path: 'chemicalagents',
                element: <ChemicalAgentPage />,
               /* element: localStorage.getItem('role') === 'Admin' ? <ChemicalAgentPage /> : <LoginPage />,*/
                loader: loaderChemAgent,
                action: actionChemAgent,               
            },
            {               
                path: "chemicalagents/:id",
                element: <ChemAgentDetailsPage />,
                loader: loaderChemDetails,
                action: actionChemDetails,
               
            },
            {
                path: "diseases",
                element: <DiseasePage />,
                loader: loaderDiseases,
                action: actionDiseases,

            },
            {
                path: "disease/:id",
                element: <DiseaseDetailsPage />,
                loader: loaderDiseaseDetails

            },
            {
                path: "chemicaltreatment",
                element: <ChemicalTreatmentPage />,
                loader: loaderChemTreatment,
                action: actionChemTreatment,

            },
            {
                path: "calculator",
                element: <CalculatorPage />,
                loader: loaderCalculator,

            },
            {
                path: "activate/:token",
                element: <AccountActivationPage/>
            },
            {
                path: "forgot-password",
                element: <ForgotPasswordPage />
            },
            {
                path: "reset-password/:token",
                element: <ResetPasswordPage />
            },
            {
                path: "notifications",
                element: <NotificationPage />,
                loader: loaderNotifications
            },
            {
                path: "users",
                element: <UsersPage />,
                loader: loaderUsers,
                action: actionUsers
            },
        ],

    },
    
]);

function App() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false); 
        }, 50);
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }
    return <RouterProvider router={router} />;
}

export default App;
