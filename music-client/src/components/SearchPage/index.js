import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom'


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

const SearchElement = () => {
    const [results, setResults] = useState([]);
    const {state} = useLocation();
    const navigate = useNavigate();
    console.log(state);

    let query = null;

    if (state.tipo === 'Artista') {
        query =  "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                "SELECT ?nome ?cognome ?eta ?genere ?dataNascita ?tipoGruppo ?gruppo ?immagine (group_concat(distinct ?strumento;separator=\", \") AS ?suona) (group_concat(distinct ?oggetto;separator=\", \") AS ?utilizza)\n" +
                "WHERE {\n" +
                "    <" + state.URI + ">  ?p  ?o .\n" +
                "    ?o foaf:firstName ?nome .\n" +
                "   ?o foaf:lastName ?cognome .\n" +
                "   ?o foaf:birthday ?dataNascita .\n" +
                "   ?o foaf:age ?eta .\n" +
                "   ?o foaf:gender ?genere .\n" +
                "   ?o music:Immagine ?immagine .\n" +
                "   ?o music:suona ?strumentoURI .\n" +
                "   ?strumentoURI music:NomeStrumentoMusicale ?strumento .\n" +
                "   ?o music:lavoraIn ?band .\n" +
                "   ?band music:NomeBandMusicale ?gruppo .\n" +
                "   ?band rdf:type ?tipoBand .\n" +
                "   ?tipoBand rdfs:label ?tipoGruppo .\n" +
                "   FILTER(?tipoBand IN (music:Gruppo, music:Solista))\n" +
                "   optional {\n" +
                "       ?o music:utilizza ?oggettoURI .\n" +
                "       ?oggettoURI rdfs:label ?oggetto\n" +
                "    }\n" +
                "}\n" +
                "GROUP BY ?nome ?cognome ?eta ?genere ?dataNascita ?gruppo ?immagine ?tipoGruppo";
    } else if (state.tipo === 'CasaProduttrice') {
        query =  "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                 "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                 "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                 "select ?nome ?descrizione ?immagine ?fondataNel ?origineTipo ?citta (group_concat(distinct ?prod;separator=\", \") AS ?produce) where { \n" +
                 "   <" + state.URI + "> ?p ?o .\n" +
                 "   ?o rdf:type music:CasaProduttrice .\n" +
                 "   ?o rdfs:comment ?descrizione .\n" +
                 "   ?o music:NomeCasaProduttrice ?nome .\n" +
                 "   ?o music:Immagine ?immagine .\n" +
                 "   ?o music:FondataNel ?fondataNel .\n" +
                 "   ?o music:ubicataIn ?ubicataIn .\n" +
                 "   ?ubicataIn music:NomeCitta ?citta .\n" +
                 "   ?ubicataIn rdf:type ?origine .\n" +
                 "   FILTER(?origine IN (music:CittaAmericana, music:CittaGiapponese)) .\n" +
                 "   ?origine rdfs:label ?origineTipo .\n" +
                 "   optional {\n" +
                 "       ?o music:produce ?strumento .\n" +
                 "       ?strumento music:NomeStrumentoMusicale ?prod\n" +
                 "   }\n" +
                 "   optional {\n" +
                 "       ?o music:producePezzi ?strumento .\n" +
                 "       ?strumento music:NomeStrumentoMusicale ?prod\n" +
                 "   }\n" +
                 "}\n" +
                 "GROUP BY ?nome ?descrizione ?immagine ?fondataNel ?origineTipo ?citta";
    } else if (state.tipo === 'StrumentoMusicale') {
        query =     "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "select ?nome ?immagine ?descrizione ?numCorde ?body ?ponte ?legni ?prodottoDaFustiURI ?prodottoDaFusti ?produzionePiattiURI ?suonatoDaURI ?suonatoCon ?suonatoIn ?prodottoDaURI ?produzionePiatti ?prodottoDa ?suonatoDa where { \n" +
                    "    <" + state.URI + "> ?p ?o .\n" +
                    "    ?o rdf:type music:StrumentoMusicale .\n" +
                    "    ?o rdfs:comment ?descrizione .\n" +
                    "    ?o music:NomeStrumentoMusicale ?nome .\n" +
                    "    ?o music:Immagine ?immagine .\n" +
                    "    optional {?o music:HaNumeroCorde ?numCorde} .\n" +
                    "    optional {?o music:Body ?body} .\n" +
                    "    optional {?o music:Ponte ?ponte} .\n" +
                    "    optional {?o music:Legni ?legni} .\n" +
                    "    optional {\n" +
                    "        ?o music:suonatoCon ?suonato .\n" +
                    "        ?suonato rdfs:label ?suonatoCon .\n" +
                    "    } .\n" +
                    "    ?o music:suonatoIn ?genere .\n" +
                    "    ?genere music:NomeGenereMusicale ?suonatoIn .\n" +
                    "    optional {\n" +
                    "        ?o music:prodottoDa ?prodottoDaURI .   \n" +
                    "        ?prodottoDaURI music:NomeCasaProduttrice ?prodottoDa .\n" +
                    "    }\n" +
                    "    optional {\n" +
                    "        ?o music:compostoDa ?fusti .   \n" +
                    "        ?fusti music:NomeStrumentoMusicale ?fustiNome .\n" +
                    "        ?fusti rdf:type music:TuttiFusti .\n" +
                    "        ?fusti music:pezziProdottiDa ?prodottoDaFustiURI .\n" +
                    "        ?prodottoDaFustiURI music:NomeCasaProduttrice ?prodottoDaFusti .\n" +
                    "        ?o music:compostoDa ?piatti .\n" +
                    "        ?piatti music:NomeStrumentoMusicale ?piattiNome .\n" +
                    "        ?piatti rdf:type music:Piatti .\n" +
                    "        ?piatti music:pezziProdottiDa ?produzionePiattiURI .\n" +
                    "        ?produzionePiattiURI music:NomeCasaProduttrice ?produzionePiatti .\n" +
                    "    }\n" +
                    "    ?o music:suonatoDa ?suonatoDaURI .\n" +
                    "    ?suonatoDaURI foaf:firstName ?artistaNome .\n" +
                    "    ?suonatoDaURI foaf:lastName ?artistaCognome .\n" +
                    "    BIND(CONCAT(?artistaNome, \" \", ?artistaCognome) AS ?suonatoDa)\n" +
                    "}";
    }

    useEffect( () => {
        const requestData = {
            query:  query,
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

    if (state.tipo === 'Artista') {
        return (
            <ResultsContainer>
            <ResultsH1>Ricerca URI</ResultsH1>
            {results.map((item) => {
                const strumenti = item.suona.value.split(", ");
                return(
                    <Item>
                    <ItemImage src={item.immagine.value}></ItemImage>
                    <ItemDescription>
                        <h1>{item.nome.value + " " + item.cognome.value}</h1>
                        <p>Data di nascita: {item.dataNascita.value}</p>
                        <p>Età: {item.eta.value}</p>
                        <p style={{marginBottom: "0px"}}>Genere: {item.genere.value}</p>
                        <hr style={{paddingTop: "3px"}} />
                        <p>{item.nome.value + " " + item.cognome.value} utilizza:
                            <ul>
                                {strumenti.map((strumento) => 
                                    <li>{strumento}</li>
                                )}
                            </ul>
                        </p>
                        {item.utilizza.value !== '' && <p>{item.nome.value + " " + item.cognome.value} suona con: "{item.utilizza.value}"</p>}
                        {item.tipoGruppo.value === 'Solista' && <p>Suona come solista e si fa chiamare: "{item.gruppo.value}"</p>}
                        {item.tipoGruppo.value === 'Gruppo' && <p>Suona nella band musicale: "{item.gruppo.value}"</p>}
                    </ItemDescription>
                    </Item>
                )
            })}
        </ResultsContainer>
        )
    } else if (state.tipo === 'CasaProduttrice') {
        return (
            <ResultsContainer>
                <ResultsH1>Ricerca URI</ResultsH1>
                {results.map((item) => {
                    const strumenti = item.produce.value.split(", ");
                    return(
                        <Item>
                        <ItemImage src={item.immagine.value}></ItemImage>
                        <ItemDescription>
                            <h1>{item.nome.value}</h1>
                            <p>{item.descrizione.value}</p>
                            <hr style={{paddingTop: "3px"}} />
                            <p>Data fondazione: {item.fondataNel.value}</p>
                            <p>Origine: {item.origineTipo.value === "CittaAmericana" ? "Americana" : "Giapponese"}</p>
                            <p>Sede principale: {item.citta.value}</p>
                            <p>{item.nome.value} produce:
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
    } else if (state.tipo === 'StrumentoMusicale') {
        return (
            <ResultsContainer>
                <ResultsH1>Ricerca URI</ResultsH1>
                {results.map((item) => 
                    <Item>
                    <ItemImage src={item.immagine.value}></ItemImage>
                    <ItemDescription>
                        {console.log(item.body)}
                        <h1>{item.nome.value}</h1>
                        <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>
                        <hr style={{paddingTop: "3px"}} />
                        {item.body !== undefined && <p>Body: {item.body.value}</p>}
                        {item.legni !== undefined && <p>Legni: {item.legni.value}</p>}
                        {item.ponte !== undefined &&<p>Ponte: {item.ponte.value}</p>}
                        {item.numCorde != undefined && <p>Numero corde: {item.numCorde.value}</p>}
                        {item.prodottoDaFusti != undefined &&<p>La batteria è composta da: 
                            <ul>
                                <li>Fusti: {item.fustiNome.value} - Prodotti da: <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                            navigate('/search', {state: {tipo: "CasaProduttrice", URI: item.produzioneFustiURI.value}});
                        }}>{item.produzioneFusti.value}</a></li>
                                <li>Piatti: {item.piattiNome.value} - Prodotti da: <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                            navigate('/search', {state: {tipo: "CasaProduttrice", URI: item.produzionePiattiURI.value}});
                        }}>{item.produzionePiatti.value}</a></li>
                            </ul>    
                        </p>}
                        <p>E' suonata dall'artista: <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                            navigate('/search', {state: {tipo: "Artista", URI: item.suonatoDaURI.value}});
                        }}>{item.suonatoDa.value}</a></p>
                        {item.suonatoCon !== null &&<p>L'artista {item.suonatoDa.value} suona la "{item.nome.value}" con: "{item.suonatoCon.value}"</p>}
                        <p>E' suonato nel genere musicale: {item.suonatoIn.value}</p>
                    </ItemDescription>
                    </Item>
                )}
            </ResultsContainer>
        )
    }
}

export default SearchElement