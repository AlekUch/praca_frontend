import classes from './NotificationPage.module.css';
import {  useState } from "react";
import { Card } from 'react-bootstrap';
import { useLoaderData, useRevalidator, useNavigate } from 'react-router-dom';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import DeleteIcon from '@mui/icons-material/Delete';
import deleteHandler from '../utils/DeleteHandler';
import Swal from 'sweetalert2';

const NotificationPage = () => {
    const data = useLoaderData();
    const [notifications, setNotifications] = useState(data);
    const { revalidate } = useRevalidator();
    const { navigate } = useNavigate();
    //if (data.isError) {
    //    return <p>Błąd: {data.message}</p>;
    //}
    const handleDelete = (notificationId) => {
        deleteHandler(notificationId, deleteNotification, revalidate);
    }

    const handleRead = async(notificationId) => {
        try {
            const token = localStorage.getItem("token");          
            const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/notifications/read/${notificationId}?isRead=true`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sukces',
                    text: result.message,
                }).then(() => {
                    navigate(0);
                });
            } else {
                Swal.fire('Błąd!', result.message, 'error');
            }
        } catch (error) {

        }
    }

    return (
        <>
            <div class="pb-5 ">
                <div className={classes.container}>
                    <div class="row" style={{ justifyContent: "center" }}>
                    <div className="col-10 text-center ">
                        <div className={classes.containerTop} >
                            <div className={classes.containerTitle} >
                                <p className="display-4"><b>Powiadomienia</b></p>
                            </div>

                        </div>
                        </div>
                        <div class="col-8" >
                            
                            {notifications.map((item) => (
                                <Card key={item.id} className="text-center" style={{
                                    fontSize: "18px", margin: 'auto', padding: "2%", marginTop: "3%",
                                    borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden',
                                    backgroundColor: item.isRead ? "white" : "#b1dff5"
                                }}>
                                    <Card.Body style={{ padding: "0" }}>
                                        <Card.Text className={classes.cardText}>
                                            <div className="row align-items-center">
                                                <div className="col-2 col-sm-1 text-center d-flex align-items-center justify-content-center">
                                                    <CircleNotificationsIcon style={{ fontSize: 50, color: item.isRead  ? "gray" :"green" }} />
                                                </div>

                                                <div className="col-8 col-sm-10">
                                                    <p>
                                                        Od <b>{new Date(item.startDate).toLocaleDateString("pl-PL")}</b>
                                                        {item.endDate && ` do ${new Date(item.endDate).toLocaleDateString("pl-PL")}` }
                                                        możesz powtórzyć zabieg środkiem <b>{item.chemAgentName}</b>
                                                   <p>
                                                            dla uprawy <b>{item.plotNumber} - {item.plantName}</b>
                                                        </p>
                                                    </p>
                                                </div>

                                                <div className="col-2 col-sm-1 text-center d-flex align-items-center justify-content-center">
                                                    {!item.isRead &&
                                                        <Tooltip title="Odczytano"
                                                            onClick={() => handleRead(item.notificationId)}>
                                                            <IconButton>
                                                                <NotificationsOffIcon style={{ fontSize: 30, color: "blue" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    <Tooltip title="Usuń">
                                                        <IconButton
                                                            onClick={() => handleDelete(item.notificationId)}>
                                                            
                                                            <DeleteIcon style={{ fontSize: 30, color: "red" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}

                            

                        </div>

                    </div>

                </div>
            </div>


        </>
    )
};
export default NotificationPage;

export async function loader({ params }) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/notifications`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
        }
    });
    if (!response.ok) {
        const result = await response.json();
        
        return { isError: true, message: result.message }
    } else {
        return await response.json();

    }
}

export async function markAsRead(notificationId, isArchiving) {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_API_URL}/agrochem/notifications/read/${notificationId}?isRead=${isArchiving}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            return { status: 'success', message: result.message };
        } else {
            const errorData = await response.json();
            return { status: 'error', message: errorData.message || 'Wystąpił błąd.' };
        }
    } catch (error) {
        return { status: 'error', message: 'Nie udało się przeprowadzić operacji .' };
    }
}

export async function deleteNotification(id) {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_API_URL}/agrochem/notifications/delete/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            return { status: 'success', message: result.message };
        } else {
            const errorData = await response.json();
            return { status: 'error', message: errorData.message || 'Wystąpił błąd podczas usuwania.' };
        }
    } catch (error) {
        return { status: 'error', message: 'Nie udało się usunąć.' };
    }
}