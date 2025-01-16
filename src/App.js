import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainNavigation />,
        //errorElement: <ErrorPage />,
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
               // action: actionChemTreatment,

            },
            //    children: [
            //        {
            //            index: true,
            //            element: <EventsPage />,
            //            loader: eventsLoader,
            //        },
            //        {
            //            path: ':eventId',
            //            id: 'event-detail',
            //            loader: eventDetailLoader,
            //            children: [
            //                {
            //                    index: true,
            //                    element: <EventDetailPage />,
            //                    action: deleteEventAction,
            //                },
            //                {
            //                    path: 'edit',
            //                    element: <EditEventPage />,
            //                    action: manipulateEventAction,
            //                },
            //            ],
            //        },
            //        {
            //            path: 'new',
            //            element: <NewEventPage />,
            //            action: manipulateEventAction,
            //        },
            //    ],
            //},
            //{
            //    path: 'newsletter',
            //    element: <NewsletterPage />,
            //    action: newsletterAction,
            //},
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
