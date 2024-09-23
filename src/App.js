import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import RootLayout from './pages/Root';

import MainNavigation from './components/MainNavigation';
import RegistrationPage from './pages/Registration';


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
