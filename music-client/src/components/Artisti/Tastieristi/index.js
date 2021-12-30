import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
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

const TastieristiElement = () => {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "SELECT DISTINCT ?tastierista ?nome ?dataNascita ?genere ?eta ?cognome ?immagine ?bandURI ?groupband ?lavoraIn (group_concat(distinct ?strumentoMusicaleURI;separator=\", \") AS ?suonaURI) (group_concat(distinct ?oggetto;separator=\", \") AS ?suonaCon) (group_concat(distinct ?strumentoMusicale;separator=\", \") AS ?suona) where{\n" +
                    "    ?tastierista rdf:type music:Tastierista .\n" +
                    "    ?tastierista foaf:firstName ?nome .\n" +
                    "    ?tastierista foaf:lastName ?cognome .\n" +
                    "    ?tastierista foaf:birthday ?dataNascita .\n" +
                    "    ?tastierista foaf:age ?eta .\n" +
                    "    ?tastierista foaf:gender ?genere .\n" +
                    "    ?tastierista music:Immagine ?immagine .\n" +
                    "    ?tastierista music:lavoraIn ?bandURI .\n" +
                    "    ?bandURI music:NomeBandMusicale ?lavoraIn .\n" +
                    "    ?bandURI rdf:type ?band .\n" +
                    "    FILTER(?band in (music:Solista, music:Gruppo))\n" +
                    "    ?band rdfs:label ?groupband .\n" +
                    "    ?tastierista music:suona ?strumentoMusicaleURI .\n" +
                    "    ?strumentoMusicaleURI music:NomeStrumentoMusicale ?strumentoMusicale .\n" +
                    "    optional {\n" +
                    "        ?strumentoMusicaleURI music:suonatoCon	?oggettoCon .\n" +
                    "        ?oggettoCon rdfs:label ?oggetto\n" +
                    "    }\n" +
                    "}\n" +
                    "GROUP BY ?tastierista ?nome ?dataNascita ?genere ?eta ?cognome ?immagine ?bandURI ?groupband ?lavoraIn",
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
            <ResultsH1>Tastieristi</ResultsH1>
            {results.map((item) => {
                const strumenti = item.suona.value.split(", ");
                const strumentiURI = item.suonaURI.value.split(", ");
                return(
                    <Item>
                    <ItemImage src={item.immagine.value}></ItemImage>
                    <ItemDescription>
                        <h1>{item.nome.value + " " + item.cognome.value}</h1>
                        <p>Data di nascita: {item.dataNascita.value}</p>
                        <p>Età: {item.eta.value}</p>
                        <p style={{marginBottom: "0px"}}>Genere: {item.genere.value}</p>
                        <hr style={{paddingTop: "3px"}} />
                        <p>{item.nome.value + " " + item.cognome.value} suona {strumenti.length !== 1 ? "le tastiere" : "la tastiera"}:
                            <ul>
                                {strumenti.map((strumento, i) => 
                                    <li>
                                        <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                                                navigate('/search', {state: {tipo: "StrumentoMusicale", URI: strumentiURI[i]}});
                                            }}>{strumento}
                                        </a>    
                                    </li>
                                )}
                            </ul>
                        </p>
                        {item.suonaCon.value !== '' && <p>{item.nome.value + " " + item.cognome.value} suona con: "{item.suonaCon.value}"</p>}
                        {item.groupband.value === 'Solista' && <p>Suona come solista e si fa chiamare: "<a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                                                                            navigate('/search', {state: {tipo: "Band", URI: item.bandURI.value}});
                                                                        }}>{item.lavoraIn.value}
                                                                    </a>"
                                                              </p>}
                        {item.groupband.value === 'Gruppo' && <p>Suona nella band musicale: "<a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                                                                            navigate('/search', {state: {tipo: "Band", URI: item.bandURI.value}});
                                                                        }}>{item.lavoraIn.value}
                                                                    </a>"
                                                              </p>}
                    </ItemDescription>
                    </Item>
                )
            })}
        </ResultsContainer>
    )
}

export default TastieristiElement
