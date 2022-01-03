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

/* Codice per la pagina dei cantanti */

const CantantiElement = () => {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect( () => {
        const requestData = {
            /* Costruzione della SPARQL Query per ricercare i dati di tutti i cantanti */
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "PREFIX mo: <http://purl.org/ontology/mo/>\n" +
                    "SELECT DISTINCT ?cantante ?nome ?dataNascita ?genere ?eta ?cognome ?immagine ?bandURI ?groupband ?lavoraIn (group_concat(distinct ?strumentoMusicaleURI;separator=\", \") AS ?suonaURI) (group_concat(distinct ?oggetto;separator=\", \") AS ?suonaCon) (group_concat(distinct ?strumentoMusicale;separator=\", \") AS ?suona) where{\n" +
                    "    ?cantante rdf:type music:Cantante .\n" +
                    "    ?cantante foaf:firstName ?nome .\n" +
                    "    ?cantante foaf:lastName ?cognome .\n" +
                    "    ?cantante foaf:birthday ?dataNascita .\n" +
                    "    ?cantante foaf:age ?eta .\n" +
                    "    ?cantante foaf:gender ?genere .\n" +
                    "    ?cantante music:Immagine ?immagine .\n" +
                    "    ?cantante music:lavoraIn ?bandURI .\n" +
                    "    ?bandURI music:NomeBandMusicale ?lavoraIn .\n" +
                    "    ?bandURI rdf:type ?band .\n" +
                    "    FILTER(?band in (mo:MusicGroup, mo:SoloMusicArtist))\n" +
                    "    ?band rdfs:label ?groupband .\n" +
                    "    ?cantante music:suona ?strumentoMusicaleURI .\n" +
                    "    ?strumentoMusicaleURI music:NomeStrumentoMusicale ?strumentoMusicale .\n" +
                    "    optional {\n" +
                    "        ?strumentoMusicaleURI music:suonatoCon	?oggettoCon .\n" +
                    "        ?oggettoCon rdfs:label ?oggetto\n" +
                    "    }\n" +
                    "}\n" +
                    "GROUP BY ?cantante ?nome ?dataNascita ?genere ?eta ?cognome ?immagine ?bandURI ?groupband ?lavoraIn",
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
            <ResultsH1>Cantanti</ResultsH1>
            {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
            {results.map((item) => {
                /* Preparo gli array nel caso in cui gli artisti suonino più di uno strumento e li separo */
                const strumenti = item.suona.value.split(", ");
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
                        {/* Restituisco le informazioni dell'artista. */}
                        <h1>{item.nome.value + " " + item.cognome.value}</h1>
                        <p>Data di nascita: {item.dataNascita.value}</p>
                        <p>Età: {item.eta.value}</p>
                        <p style={{marginBottom: "0px"}}>Genere: {item.genere.value}</p>
                        <hr style={{paddingTop: "3px"}} />
                        <p>{item.nome.value + " " + item.cognome.value} utilizza {strumenti.length !== 1 ? "i microfoni" : "il microfono"}:
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
                        {item.suonaCon.value !== '' && <p>{item.nome.value + " " + item.cognome.value} suona con: "{item.suonaCon.value}"</p>}
                        {/* Se è un solista restituisce un certo paragrafo, altrimenti un altro. Il gruppo dove suona sarà linkato. */}
                        {item.groupband.value === 'Solista' && <p>Suona come solista e si fa chiamare: "<a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                                            e.preventDefault();
                                                                            navigate('/search', {state: {tipo: "Band", URI: item.bandURI.value}});
                                                                        }}>{item.lavoraIn.value}
                                                                    </a>"
                                                              </p>}
                        {item.groupband.value === 'Gruppo' && <p>Suona nella band musicale: "<a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                                            e.preventDefault();
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

export default CantantiElement