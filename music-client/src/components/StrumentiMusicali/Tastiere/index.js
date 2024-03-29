import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';

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

/* Codice per la pagina delle tastiere */

const TastieraElement = () => {

    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect( () => {
        /* Costruzione della SPARQL Query per ricercare i dati di tutti i microfoni */
        const requestData = {
          query:    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + 
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" + 
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" + 
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" + 
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" + 
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" + 
                    "SELECT ?tastiera ?nome ?immagine ?descrizione ?suonatoDaURI ?suonatoIn ?prodottoDaURI ?prodottoDa ?suonatoDa\n" + 
                    "    WHERE { ?tastiera rdf:type music:Tastiera .\n" + 
                    "        ?tastiera music:DescrizioneStrumento ?descrizione .\n" + 
                    "        ?tastiera music:Immagine ?immagine .\n" + 
                    "        ?tastiera music:NomeStrumentoMusicale ?nome .\n" + 
                    "        ?tastiera music:suonatoIn ?genere . \n" + 
                    "        ?genere music:NomeGenereMusicale ?suonatoIn .\n" + 
                    "        ?tastiera music:prodottoDa ?prodottoDaURI . \n" + 
                    "        ?prodottoDaURI music:NomeCasaProduttrice ?prodottoDa .\n" + 
                    "        ?tastiera music:suonatoDa ?suonatoDaURI .\n" + 
                    "        ?suonatoDaURI foaf:firstName ?artistaNome .\n" + 
                    "        ?suonatoDaURI foaf:lastName ?artistaCognome .\n" + 
                    "        BIND(CONCAT(?artistaNome, \" \", ?artistaCognome) AS ?suonatoDa)\n" + 
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
        <ResultsContainer>
            <ResultsH1>Tastiere</ResultsH1>
            {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
            {results.map((item) => 
                <Item>
                  <ItemImage src={item.immagine.value}></ItemImage>
                  <ItemDescription>
                    {/* Restituisco le informazioni dello strumento musicale. */}
                    <h1>{item.nome.value}</h1>
                    <p>{item.descrizione.value}</p>
                    <hr style={{paddingTop: "3px"}} />
                    <p>E' prodotto dalla casa produttrice: <a href="/#" style={{color: 'black'}} onClick={(e) => {
                        e.preventDefault();
                        navigate('/search', {state: {tipo: "CasaProduttrice", URI: item.prodottoDaURI.value}});
                    }}>{item.prodottoDa.value}</a></p>
                    <p>E' suonato dall'artista: <a href="/#" style={{color: 'black'}} onClick={(e) => {
                        e.preventDefault();
                        navigate('/search', {state: {tipo: "Artista", URI: item.suonatoDaURI.value}});
                    }}>{item.suonatoDa.value}</a></p>
                    <p>E' suonato nel genere musicale: {item.suonatoIn.value}</p>
                  </ItemDescription>
                </Item>
            )}
        </ResultsContainer>
    )
}

export default TastieraElement
