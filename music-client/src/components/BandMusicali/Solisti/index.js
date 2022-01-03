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

/* Codice per la pagina dei solisti */

const SolistiElement = () => {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect( () => {
        /* Costruzione della SPARQL Query per ricercare i dati di tutti i solisti */
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "SELECT DISTINCT ?band ?descrizione ?nome ?numArtisti ?suonatoDaURI ?immagine (group_concat(distinct ?artisti;separator=\", \") AS ?artistiNome) where {\n" +
                    "    ?band rdf:type music:Solista .\n" +
                    "    ?band rdfs:comment ?descrizione .\n" +
                    "    ?band music:NomeBandMusicale ?nome .\n" +
                    "    ?band music:HaNumeroArtisti ?numArtisti .\n" +
                    "    ?band music:Immagine ?immagine .\n" +
                    "    ?citta rdf:type ?origineTipo .\n" +
                    "    ?band music:haLavoratori ?suonatoDaURI .\n" +
                    "    ?suonatoDaURI foaf:firstName ?artistaNome .\n" +
                    "    ?suonatoDaURI foaf:lastName ?artistaCognome .\n" +
                    "   BIND(CONCAT(?artistaNome, \" \", ?artistaCognome) AS ?artisti)\n" +
                    "}\n" +
                    "GROUP BY ?band ?descrizione ?nome ?numArtisti ?immagine ?suonatoDaURI",
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
            <ResultsH1>Band musicali - Solisti</ResultsH1>
            {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
            {results.map((item) => {
                /* Preparo gli array dividendo il nome dalla descrizione che la segue, così posso linkare il nome dell'artista. */
                let nomeArray = item.descrizione.value.split(" ");
                let nome = nomeArray.slice(0, 2).join(" ");
                let desc = nomeArray.slice(2, nomeArray.length).join(" ");
                /* 
                    Restituisco i componenti con le informazioni ricevute dalla SPARQL Query.
                    Inoltre vengono aggiunti dei link verso una pagina di ricerca, in modo che
                    alcune informazioni sono collegato e si può andare a vedere la descrizione del link
                    cliccato.
                */
                return(
                    <Item>
                    <ItemImage src={item.immagine.value}></ItemImage>
                    <ItemDescription>
                        {/* Restituisco le informazioni del solista. */}
                        <h1 style={{marginBottom: "0px"}}>{item.nome.value}</h1>
                        <hr style={{paddingTop: "3px"}} />
                        <p>
                        <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/search', {state: {tipo: "Artista", URI: item.suonatoDaURI.value}});
                                            }}>{nome}</a>{" " + desc}
                        </p>
                    </ItemDescription>
                    </Item>
                )
            })}
        </ResultsContainer>
    )
}

export default SolistiElement
