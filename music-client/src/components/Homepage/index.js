import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

/* Codice CSS per tutti gli elementi della pagina */

const HomeContainer = styled.div`
    min-height: 100vh;
    background-color: #101522;
    padding: 2rem;
`

const HomeDescription = styled.div`
    display: flex;
    flex-direction: row;
    background-color: white;
    padding: 1rem;
    width: 80%;
    margin: 0 auto;
    border-radius: 5px;
    margin-bottom: 20px;
`

const HomeImage = styled.img`
    width: 400px;
    height: 400px;
    flex-shrink: 1;
    margin-right: 20px;
`

const Description = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const HomeH1 = styled.h1`
    padding: 1rem;
    padding-left: 40px;
    padding-bottom: 3rem;
    color: #fff;
`

/* Codice per la homepage */

const HomeElement = () => {
    const [results, setResults] = useState([]);

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect( () => {
        /* Costruzione della SPARQL Query per ricercare le informazioni dell'ontologia */
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "PREFIX dc: <http://purl.org/dc/elements/1.1/>\n" +
                    "PREFIX vann: <http://purl.org/vocab/vann/>\n" +
                    "SELECT ?ontology ?titolo ?descrizione ?creatore ?data ?namespacePreffered ?namespaceUri \n" +
                    "WHERE {\n" +
                    "?ontology dc:description ?descrizione .\n" +
                    "?ontology dc:title ?titolo . \n" +
                    "?ontology dc:creator ?creatore .\n" +
                    "?ontology dc:date ?data .\n" +
                    "?ontology vann:preferredNamespacePrefix ?namespacePreffered .\n" +
                    "?ontology vann:preferredNamespaceUri ?namespaceUri .\n" +
                    "}",
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
        <HomeContainer>
            {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
            {results.map((item) =>
                <>
                    <HomeH1>{item.titolo.value}</HomeH1>
                    <HomeDescription>
                        {/* Restituisco le informazioni dell'ontologia */}
                        <HomeImage src={require('../../images/logo.jpeg')}></HomeImage>
                            <Description>
                                <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>
                                <hr style={{paddingTop: "3px"}} />
                                <p>Autore: {item.creatore.value}</p>
                                <p>Data di presentazione: {item.data.value}</p>
                                <p>Prefisso suggerito dell'ontologia: {item.namespacePreffered.value}</p>
                                <p>Namespace dell'ontologia: {item.namespaceUri.value}</p>
                            </Description>
                    </HomeDescription>
                </>
            )}
            
        </HomeContainer>
    )
}

export default HomeElement
