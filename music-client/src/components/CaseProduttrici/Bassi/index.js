import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
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

/* Codice per la pagina delle case produttrici dei bassi elettrici */

const CaseProdBassiElement = () => {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect( () => {
        /* Costruzione della SPARQL Query per ricercare i dati di tutte le case produttrici dei bassi elettrici */
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "SELECT DISTINCT ?casaProdBassi ?descrizione ?nome ?immagine ?dataFond ?origine ?nomecitta (group_concat(distinct ?strumentoMusicaleURI;separator=\", \") AS ?suonaURI) (group_concat(distinct ?prod;separator=\", \") AS ?produce) where {\n" +
                    "    ?casaProdBassi rdf:type music:CasaProduttriceBasso .\n" +
                    "    ?casaProdBassi rdfs:comment ?descrizione .\n" +
                    "    ?casaProdBassi music:NomeCasaProduttrice ?nome .\n" +
                    "    ?casaProdBassi music:Immagine ?immagine .\n" +
                    "    ?casaProdBassi music:FondataNel ?dataFond .\n" +
                    "    ?casaProdBassi music:ubicataIn ?citta .\n" +
                    "    ?citta music:NomeCitta ?nomecitta .\n" +
                    "    ?citta rdf:type ?origineTipo .\n" +
                    "    FILTER(?origineTipo IN (music:CittaAmericana, music:CittaGiapponese))\n" +
                    "    ?origineTipo rdfs:label ?origine .\n" +
                    "    optional {\n" +
                    "        ?casaProdBassi music:produce ?strumentoMusicaleURI .\n" +
                    "        ?strumentoMusicaleURI rdf:type ?strumentoTipo .\n" +
                    "        FILTER(?strumentoTipo IN (music:Basso)) .\n" +
                    "        ?strumentoMusicaleURI music:NomeStrumentoMusicale ?prod\n" +
                    "    }\n" +
                    "    optional {\n" +
                    "        ?casaProdBassi music:producePezzi ?strumentoMusicaleURI .\n" +
                    "        ?strumentoMusicaleURI music:NomeStrumentoMusicale ?prod\n" +
                    "    }\n" +
                    "}\n" +
                    "GROUP BY ?casaProdBassi ?descrizione ?nome ?immagine ?dataFond ?origine ?nomecitta",
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
            <ResultsH1>Case Produttrici Bassi</ResultsH1>
            {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
            {results.map((item) => {
                /* Preparo gli array nel caso in cui le case produttrici producano più di uno strumento */
                const strumenti = item.produce.value.split(", ");
                const strumentiURI = item.suonaURI.value.split(", ");
                /* 
                    Restituisco i componenti con le informazioni ricevute dalla SPARQL Query.
                    Inoltre vengono aggiunti dei link verso una pagina di ricerca, in modo che
                    alcune informazioni sono collegato e si può andare a vedere la descrizione del link
                    cliccato. Le informazioni vengono restituite controllando se esistono, altrimenti il 
                    paragrafo non viene renderizzato.
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
                        <p>{item.nome.value} produce {strumenti.length !== 1 ? "i bassi" : "il basso"}:
                            <ul>
                                {/* Effettuo un ciclo sull'array degli strumenti per creare l'elenco, con ogni strumento linkato. */}
                                {strumenti.map((strumento, i) => 
                                    <li>
                                        <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/search', {state: {tipo: "StrumentoMusicale", URI: strumentiURI[i]}});
                                            }}>{strumento}
                                        </a>
                                    </li>
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

export default CaseProdBassiElement