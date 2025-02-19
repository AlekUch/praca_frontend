import classes from './DiseaseDetails.module.css';
import React from "react";
import {Card} from 'react-bootstrap';
import { useLoaderData } from 'react-router-dom';



const DiseaseDetails = () => {
    const data = useLoaderData();
    if (data.isError) {
        return <p>Błąd: {data.message}</p>;
    }
    return (
        <>
            <div class="pb-5 ">
                <div className={classes.container}>
                    <div class="row" style={{ justifyContent:"center" }}>
                        <div class="col-8" > 
                            <Card className="text-center" style={{ minHeight: "100px", margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                                <Card.Body style={{ borderRadius: '10px' }}>
                                    <Card.Title  className="display-4"><b>{data.name}</b></Card.Title>
                                    <Card.Text className={classes.cardText}>
                                        <p style={{ color: 'black', fontSize: '16px', textAlign: 'center' }} ><b> Atakowane rośliny:</b> {data.plantDiseases}</p>
                                        <p style={{ color: 'black', fontSize: '16px', textAlign: 'center' }}><b> Przyczyna:</b> {data.reasons}</p>
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                            <Card className="text-center" style={{ margin: 'auto',marginTop:"3%", borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                                <Card.Body style={{ padding: "0" }}>
                                    <Card.Img
                                        variant="top"
                                        src={data.photo}
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                </Card.Body>
                            </Card>
                            
                                       
                            <Card className="text-center" style={{ marginTop: "3%",  borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                                <Card.Body >
                                    <Card.Title className={classes.cardTitle}>Charakterystyka</Card.Title>
                                    <Card.Text className={classes.cardText}>
                                        {data.characteristic}
                                      
                                    </Card.Text>

                                </Card.Body>
                            </Card>     
                            <Card className="text-center" style={{ marginTop: "3%", borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/agrochem/disease/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Przekazujemy token w nagłówku
        }
    });
    if (!response.ok) {
        const result = await response.json();
       
        return { isError: true, message: result.message }
    } else {
        return await response.json();
    }
}