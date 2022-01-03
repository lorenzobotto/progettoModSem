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

/* Codice per la pagina dei tastieristi */
const TastieristiElement = () => {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect( () => {
        const requestData = {
            /* Costruzione della SPARQL Query per ricercare i dati di tutti i tastieristi */
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "PREFIX mo: <http://purl.org/ontology/mo/>\n" +
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
                    "    FILTER(?band in (mo:MusicGroup, mo:SoloMusicArtist))\n" +
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
            <ResultsH1>Tastieristi</ResultsH1>
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
                        <p>{item.nome.value + " " + item.cognome.value} suona {strumenti.length !== 1 ? "le tastiere" : "la tastiera"}:
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

export default TastieristiElement
