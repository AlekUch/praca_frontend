import classes from './DiseaseDetails.module.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Dropdown, Button, Card, Table, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, json, useSubmit, useActionData, useRevalidator, useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useRouteLoaderData } from "react-router";
const MySwal = withReactContent(Swal);


const DiseaseDetails = () => {
    const data = useLoaderData();
    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }
    return (
        <>
            <div class="pb-5 ">
                <div className={classes.container}>
                    <div class="row">
                        <div class="col-6">                          
                            <Card className="text-center" style={{ minHeight:"300px",  margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                                <Card.Body style={{ borderRadius: '10px', backgroundColor: "#699ff1" } }>
                                    <Card.Title className={classes.cardTitle}>{data.name}</Card.Title>
                                    <Card.Text className={classes.cardText}>
                                        <p style={{ color: 'black', fontSize: '16px', textAlign: 'center' }}><b> Atakowane rośliny:</b> {data.plantDiseases}</p>
                                        <p style={{ color: 'black', fontSize: '16px', textAlign: 'center' }}><b> Przyczyna:</b> {data.reasons}</p>
                                        </Card.Text>

                                </Card.Body>
                            </Card>
                                       
                            <Card className="text-center" style={{ marginTop: "10px",  borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                                <Card.Body >
                                    <Card.Title className={classes.cardTitle}>Charakterystyka</Card.Title>
                                    <Card.Text className={classes.cardText}>
                                        {data.characteristic}
                                      
                                    </Card.Text>

                                </Card.Body>
                            </Card>     
                               

                            
                        </div>
                        <div class="col-6">
                            <Card className="text-center" style={{  margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                                <Card.Body style={{padding:"0"} }>
                                    <Card.Img
                                        variant="top"
                                        src={data.photo}
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                </Card.Body>
                            </Card>
                            <Card className="text-center" style={{ marginTop: "10px",  borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                                <Card.Body >
                                    <Card.Title className={classes.cardTitle}>Zwalczanie</Card.Title>
                                    <Card.Text className={classes.cardText}>

                                        {data.prevention}
                                    </Card.Text>

                                </Card.Body>
                            </Card>  
                        </div>
                    </div>
                   
                </div>
            </div>
          

        </>
    )
};
export default DiseaseDetails;

export async function loader({params }) {
    const token = localStorage.getItem("token");
    const { id } = params;
    const response = await fetch(`https://localhost:44311/agrochem/disease/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
        }
    });
    if (!response.ok) {
        const result = await response.json();
        console.log(result);
        return { isError: true, message: result.message }
    } else {
        return await response.json();
    }
}