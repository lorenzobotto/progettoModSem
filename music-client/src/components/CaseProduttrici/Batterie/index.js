import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

/* Codice CSS per tutti gli elementi della pagina */

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

/* Codice per la pagina delle case produttrici delle batterie */

const CaseProdBatterieElement = () => {
    const [results, setResults] = useState([]);

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect( () => {
        /* Costruzione della SPARQL Query per ricercare i dati di tutte le case produttrici delle batterie */
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + 
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" + 
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" + 
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" + 
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" + 
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" + 
                    "SELECT DISTINCT ?casaProdBatterie ?descrizione ?nome ?immagine ?dataFond ?tipoCasa ?origine ?nomecitta (group_concat(distinct ?strumentoMusicaleURI;separator=\", \") AS ?suonaURI) (group_concat(distinct ?prod;separator=\", \") AS ?produce) where {\n" + 
                    "    ?casaProdBatterie rdf:type ?tipoCasaProd .\n" + 
                    "    FILTER(?tipoCasaProd IN (music:CasaProduttriceBatteria, music:CasaProduttricePiatti)) .\n" + 
                    "    ?tipoCasaProd rdfs:label ?tipoCasa .\n" +
                    "    ?casaProdBatterie rdfs:comment ?descrizione .\n" + 
                    "    ?casaProdBatterie music:NomeCasaProduttrice ?nome .\n" + 
                    "    ?casaProdBatterie music:Immagine ?immagine .\n" + 
                    "    ?casaProdBatterie music:FondataNel ?dataFond .\n" + 
                    "    ?casaProdBatterie music:ubicataIn ?citta .\n" + 
                    "    ?citta music:NomeCitta ?nomecitta .\n" + 
                    "    ?citta rdf:type ?origineTipo .\n" + 
                    "    FILTER(?origineTipo IN (music:CittaAmericana, music:CittaGiapponese))\n" + 
                    "    ?origineTipo rdfs:label ?origine .\n" + 
                    "    optional {\n" + 
                    "        ?casaProdBatterie music:produce ?strumentoMusicaleURI .\n" + 
                    "        ?strumentoMusicaleURI music:NomeStrumentoMusicale ?prod\n" + 
                    "    }\n" + 
                    "    optional {\n" + 
                    "        ?casaProdBatterie music:producePezzi ?strumentoMusicaleURI .\n" + 
                    "        ?strumentoMusicaleURI music:NomeStrumentoMusicale ?prod\n" + 
                    "    }\n" + 
                    "}\n" + 
                    "GROUP BY ?casaProdBatterie ?descrizione ?nome ?immagine ?dataFond ?tipoCasa ?origine ?nomecitta",
            infer: true,
            sameAs: true
        }
      
        /* Metodo e Headers per la chiamata HTTP */
        const requestOptions = {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      
      /* Chiamata HTTP a GraphDB inserendo i parametri precedentemente costruiti. Quando i dati sono restituiti vengono inseriti in un array */
      fetch('http://localhost:7200/repositories/musical-instruments?' + new URLSearchParams(requestData), requestOptions)
      .then(response => response.json())
      .then(data => setResults(data.results.bindings));
      }, []);

    return (
        /* Rendering di tutti i componenti */
        <ResultsContainer>
            <ResultsH1>Case Produttrici Batterie</ResultsH1>
            {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
            {results.map((item) => {
                /* Preparo gli array nel caso in cui le case produttrici producano più di uno strumento */
                const strumenti = item.produce.value.split(", ");
                /* 
                    Restituisco i componenti con le informazioni ricevute dalla SPARQL Query.
                */
                return(
                    <Item>
                    <ItemImage src={item.immagine.value}></ItemImage>
                    <ItemDescription>
                        {/* Restituisco le informazioni della casa produttrice. */}
                        <h1>{item.nome.value}</h1>
                        <p>{item.descrizione.value}</p>
                        <hr style={{paddingTop: "3px"}} />
                        <p>Data fondazione: {item.dataFond.value}</p>
                        <p>Origine: {item.origine.value === "CittaAmericana" ? "Americana" : "Giapponese"}</p>
                        <p>Sede principale: {item.nomecitta.value}</p>
                        {/* Controllo se è una casa produttrice di fusti o di piatti, e restituisco le informazioni relative */}
                        {item.tipoCasa.value === "CasaProduttriceBatteria" && 
                            <p>{item.nome.value} produce {strumenti.length !== 1 ? "le batterie" : "la batteria"}:
                                <ul>
                                    {strumenti.map((strumento, i) => 
                                        <li>
                                            {strumento}
                                        </li>
                                    )}
                                </ul>
                            </p>
                        }
                        {item.tipoCasa.value === "CasaProduttricePiatti" && 
                            <p>{item.nome.value} produce i piatti:
                                <ul>
                                    {strumenti.map((strumento) => 
                                        <li>
                                            {strumento}
                                        </li>
                                    )}
                                </ul>
                            </p>
                        }
                    </ItemDescription>
                    </Item>
                )
            })}
        </ResultsContainer>
    )
}

export default CaseProdBatterieElement