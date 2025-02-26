import classes from './StartPage.module.css';
import { Card } from 'react-bootstrap';
function StartPage() {

    return (
        <>

        <div style={{ width: '100%' }} className="p-5 text-center bg-body-tertiary ">
            <div className={classes.containerTop} >
                <div className={classes.containerTitle} >

                        <p className="display-2"><b>AGROCHEM</b></p>
                    </div>
                </div>
                <div class="row justify-content-center align-items-center mt-5" >
                    <div class="col-10" >
                        <Card className="text-center" style={{ minHeight: "100px", margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                            <Card.Body style={{ borderRadius: '10px' }}>
                                <Card.Title className="display-4"><b></b></Card.Title>
                                <Card.Text className={classes.cardText}>
                                    <p className="display-6" ><b> Czym jest aplikacja AGROCHEM?</b> </p>
                                    <p style={{ color: 'black', fontSize: '20px', textAlign: 'justify' }}>
                                        Głównym zadaniem aplikacji jest uproszczenie zarządzania
                                        i przechowywania informacji w sektorze rolniczym. Umożliwia ona zarządzanie informacjami
                                        o działkach, uprawach roślinnych oraz zabiegach ochrony roślin. Ponadto zawiera sekcje informacyjną o 
                                        roślinach i środkach chemicznych dostępnych w systemie, a także przezentuje choroby roślin.
                                    </p>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                        </div>              
                </div>
                <div class="row justify-content-center align-items-center mt-5" >
                    <div class="col-10" >
                        <Card className="text-center" style={{ minHeight: "100px", margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                            <Card.Body style={{ borderRadius: '10px' }}>
                                <Card.Title className="display-4"><b></b></Card.Title>
                                <Card.Text className={classes.cardText}>
                                    <p className="display-6" ><b> Korzystanie z aplikacji AGROCHEM.</b> </p>
                                    <p style={{ color: 'black', fontSize: '20px', textAlign: 'justify' }}>
                                        Korzystanie z aplikacji jest możliwe po utworzeniu konta. W tym celu należy kliknać przycisk
                                        "Zarejestruj" znajdujący się na pasku nawigacyjnym strony, a następnie wypełnić formularz rejstracji.
                                        Po poprawnym zapisaniu danych, na podanego maila zostanie wysłany link aktywacyjny. Po jego kliknięciu nastąpi
                                        aktywacja konta i będzie można zalogować się do systemu.
                                        Po poprawnym zalogowaniu użytkownik otrzyma dostęp do elementów systemu oraz może zarządzać zasobami
                                        takimi jak: </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="dzialki.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="uprawy.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="zabiegiChem.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                    <p style={{ color: 'black', fontSize: '20px', textAlign: 'justify' }}><b> Dodawanie nowych elementów odbywa się poprzez formularze, które otwierają się
                                        po kliknięciu czerwonego przycisku "Dodaj...".  Dane te można również edytować, archiwizować
                                        lub usuwać za pomoca przycisków z ikonkami znajdującymi sie w tabelce. Przykładowy formularz przedstawiono poniżej:</b>
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="formularz.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width:"40%" }}
                                        />
                                    </p>
                                    <p style={{ color: 'black', fontSize: '20px', textAlign: 'justify' }}><b> Aplikacja
                                        posiada także "Kalkulator oprysku". Na podstawie wprowadzonych danych obliczy on dawkę środka
                                        chemicznego oraz wody,które należy użyć dla wybranej działki. Działanie tej funkcjonalności przedstawiono poniżej</b>
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="kalkulator.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                    <p style={{ color: 'black', fontSize: '20px', textAlign: 'justify' }}><b>
                                        Ponadto w aplikacji znajduje sie sekcja informacyjna, w której znajdują się podstrony takie jak:
                                    </b>
                                    </p>
                                    
                                        <p>
                                            <Card.Img
                                                variant="top"
                                                src="srodkichem.png"
                                                style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                            />
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="choroby.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="rosliny.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                    <p style={{ color: 'black', fontSize: '20px', textAlign: 'justify' }}><b>
                                        System został też wzbogacony o automatyczne powiadomienia o możliwości ponownego wykonania zabiegu.
                                    </b>
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="oknopow.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                    <p>
                                        <Card.Img
                                            variant="top"
                                            src="powiadomienia.png"
                                            style={{ objectFit: 'cover', border: '2px solid black', borderRadius: '8px', width: "70%" }}
                                        />
                                    </p>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </>        
    )}

export default StartPage;