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

const GruppiElement = () => {
    const [results, setResults] = useState([]);

    useEffect( () => {
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "SELECT DISTINCT ?band ?descrizione ?nome ?numArtisti ?immagine (group_concat(distinct ?artisti;separator=\", \") AS ?artistiNome) where {\n" +
                    "    ?band rdf:type music:Gruppo .\n" +
                    "    ?band rdfs:comment ?descrizione .\n" +
                    "    ?band music:NomeBandMusicale ?nome .\n" +
                    "    ?band music:HaNumeroArtisti ?numArtisti .\n" +
                    "    ?band music:Immagine ?immagine .\n" +
                    "    ?citta rdf:type ?origineTipo .\n" +
                    "    ?band music:haLavoratori ?artistiIRI .\n" +
                    "    ?artistiIRI foaf:firstName ?artistaNome .\n" +
                    "    ?artistiIRI foaf:lastName ?artistaCognome .\n" +
                    "   BIND(CONCAT(?artistaNome, \" \", ?artistaCognome) AS ?artisti)\n" +
                    "}\n" +
                    "GROUP BY ?band ?descrizione ?nome ?numArtisti ?immagine",
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
            <ResultsH1>Band musicali - Gruppi</ResultsH1>
            {results.map((item) => {
                const artisti = item.artistiNome.value.split(", ");
                return(
                    <Item>
                    <ItemImage src={item.immagine.value}></ItemImage>
                    <ItemDescription>
                        <h1>{item.nome.value}</h1>
                        <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>
                        <hr style={{paddingTop: "3px"}} />
                        <p>Nella band musicale "{item.nome.value}" suonano {item.numArtisti.value} artisti:
                            <ul>
                                {artisti.map((artista) => 
                                    <li>{artista}</li>
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

export default GruppiElement
