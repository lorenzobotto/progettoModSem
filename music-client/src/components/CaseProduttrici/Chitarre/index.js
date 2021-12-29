import React, {useState, useEffect} from 'react';
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

const CaseProdChitarreElement = () => {
    const [results, setResults] = useState([]);

    useEffect( () => {
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "SELECT DISTINCT ?casaProdChitarre ?descrizione ?nome ?immagine ?dataFond ?origine ?nomecitta (group_concat(distinct ?prod;separator=\", \") AS ?produce) where {\n" +
                    "    ?casaProdChitarre rdf:type music:CasaProduttriceChitarra .\n" +
                    "    ?casaProdChitarre rdfs:comment ?descrizione .\n" +
                    "    ?casaProdChitarre music:NomeCasaProduttrice ?nome .\n" +
                    "    ?casaProdChitarre music:Immagine ?immagine .\n" +
                    "    ?casaProdChitarre music:FondataNel ?dataFond .\n" +
                    "    ?casaProdChitarre music:ubicataIn ?citta .\n" +
                    "    ?citta music:NomeCitta ?nomecitta .\n" +
                    "    ?citta rdf:type ?origineTipo .\n" +
                    "    FILTER(?origineTipo IN (music:CittaAmericana, music:CittaGiapponese))\n" +
                    "    ?origineTipo rdfs:label ?origine .\n" +
                    "    optional {\n" +
                    "        ?casaProdChitarre music:produce ?strumento .\n" +
                    "        ?strumento rdf:type ?strumentoTipo .\n" +
                    "        FILTER(?strumentoTipo IN (music:Chitarra)) .\n" +
                    "        ?strumento music:NomeStrumentoMusicale ?prod\n" +
                    "    }\n" +
                    "    optional {\n" +
                    "        ?casaProdChitarre music:producePezzi ?strumento .\n" +
                    "        ?strumento music:NomeStrumentoMusicale ?prod\n" +
                    "    }\n" +
                    "}\n" +
                    "GROUP BY ?casaProdChitarre ?descrizione ?nome ?immagine ?dataFond ?origine ?nomecitta",
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

    return (
        <ResultsContainer>
            <ResultsH1>Case Produttrici Chitarre</ResultsH1>
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
                        <p>{item.nome.value} produce {strumenti.length !== 1 ? "le chitarre" : "la chitarra"}:
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

export default CaseProdChitarreElement