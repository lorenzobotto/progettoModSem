import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';


const ResultsContainer = styled.div`
    min-height: 100vh;
    background-color: #101522;
    padding: 2rem;
`

const Item = styled.div`
    display: flex;
    flex-direction: row;
    background-color: white;
    padding: 1rem;
    width: 80%;
    margin: 0 auto;
    border-radius: 5px;
    margin-bottom: 20px;
`

const ItemImage = styled.img`
    width: 300px;
    height: 300px;
    flex-shrink: 1;
    margin-right: 20px;
`

const ItemDescription = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const ResultsH1 = styled.h1`
    padding: 1rem;
    padding-left: 40px;
    padding-bottom: 3rem;
    color: #fff;
`

const SearchElement = () => {
    const [results, setResults] = useState([]);
    const {state} = useLocation();

    let query = null;

    if (state.tipo === 'Artista') {
        query =  "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                "SELECT ?nome ?cognome ?eta ?genere ?dataNascita ?tipoGruppo ?gruppo ?immagine (group_concat(distinct ?strumento;separator=\", \") AS ?suona) (group_concat(distinct ?oggetto;separator=\", \") AS ?utilizza)\n" +
                "WHERE {\n" +
                "    <" + state.URI + ">  ?p  ?o .\n" +
                "    ?o foaf:firstName ?nome .\n" +
                "   ?o foaf:lastName ?cognome .\n" +
                "   ?o foaf:birthday ?dataNascita .\n" +
                "   ?o foaf:age ?eta .\n" +
                "   ?o foaf:gender ?genere .\n" +
                "   ?o music:Immagine ?immagine .\n" +
                "   ?o music:suona ?strumentoURI .\n" +
                "   ?strumentoURI music:NomeStrumentoMusicale ?strumento .\n" +
                "   ?o music:lavoraIn ?band .\n" +
                "   ?band music:NomeBandMusicale ?gruppo .\n" +
                "   ?band rdf:type ?tipoBand .\n" +
                "   ?tipoBand rdfs:label ?tipoGruppo .\n" +
                "   FILTER(?tipoBand IN (music:Gruppo, music:Solista))\n" +
                "   optional {\n" +
                "       ?o music:utilizza ?oggettoURI .\n" +
                "       ?oggettoURI rdfs:label ?oggetto\n" +
                "    }\n" +
                "}\n" +
                "GROUP BY ?nome ?cognome ?eta ?genere ?dataNascita ?gruppo ?immagine ?tipoGruppo";
    }

    useEffect( () => {
        const requestData = {
            query:  query,
            infer: true,
            sameAs: true
        }

        const requestOptions = {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          }
        
        fetch('http://localhost:7200/repositories/musical-instruments?' + new URLSearchParams(requestData), requestOptions)
        .then(response => response.json())
        .then(data => setResults(data.results.bindings));
    }, []);

    if (state.tipo === 'Artista') {
        return (
            <ResultsContainer>
            <ResultsH1>Ricerca URI</ResultsH1>
            {results.map((item) => {
                const strumenti = item.suona.value.split(", ");
                return(
                    <Item>
                    <ItemImage src={item.immagine.value}></ItemImage>
                    <ItemDescription>
                        <h1>{item.nome.value + " " + item.cognome.value}</h1>
                        <p>Data di nascita: {item.dataNascita.value}</p>
                        <p>Età: {item.eta.value}</p>
                        <p style={{marginBottom: "0px"}}>Genere: {item.genere.value}</p>
                        <hr style={{paddingTop: "3px"}} />
                        <p>{item.nome.value + " " + item.cognome.value} utilizza:
                            <ul>
                                {strumenti.map((strumento) => 
                                    <li>{strumento}</li>
                                )}
                            </ul>
                        </p>
                        {item.utilizza.value !== '' && <p>{item.nome.value + " " + item.cognome.value} suona con: "{item.utilizza.value}"</p>}
                        {item.tipoGruppo.value === 'Solista' && <p>Suona come solista e si fa chiamare: "{item.gruppo.value}"</p>}
                        {item.tipoGruppo.value === 'Gruppo' && <p>Suona nella band musicale: "{item.gruppo.value}"</p>}
                    </ItemDescription>
                    </Item>
                )
            })}
        </ResultsContainer>
        )
    } else {
        return (
            <ResultsContainer>
                <ResultsH1>Case Produttrici Bassi</ResultsH1>
                {results.map((item) => {
                    const strumenti = item.produce.value.split(", ");
                    return(
                        <Item>
                        <ItemImage src={item.immagine.value}></ItemImage>
                        <ItemDescription>
                            <h1>{item.nome.value}</h1>
                            <p>{item.descrizione.value}</p>
                            <hr style={{paddingTop: "3px"}} />
                            <p>Data fondazione: {item.dataFond.value}</p>
                            <p>Origine: {item.origine.value === "CittaAmericana" ? "Americana" : "Giapponese"}</p>
                            <p>Sede principale: {item.nomecitta.value}</p>
                            <p>{item.nome.value} produce {strumenti.length !== 1 ? "i bassi" : "il basso"}:
                                <ul>
                                    {strumenti.map((strumento) => 
                                        <li>{strumento}</li>
                                    )}
                                </ul>
                            </p>
                        </ItemDescription>
                        </Item>
                    )
                })}
            </ResultsContainer>
        )
    }
}

export default SearchElement