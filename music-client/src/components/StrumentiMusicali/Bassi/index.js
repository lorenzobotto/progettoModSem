import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
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

const BassoElement = () => {
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
                    "SELECT ?basso ?nome ?descrizione ?immagine ?numCorde ?ponte ?legni ?suonatoCon ?suonatoIn ?prodottoDa ?suonatoDaURI ?suonatoDa\n" +
                    "    WHERE { ?basso rdf:type music:Basso .\n" +
                        "        ?basso music:NomeStrumentoMusicale ?nome .\n" +
                        "    ?basso music:HaNumeroCorde ?numCorde .\n" +
                        "    ?basso rdfs:comment ?descrizione .\n" +
                        "   ?basso music:Ponte ?ponte .\n" +
                        "   ?basso music:Legni ?legni .\n" +
                        "   ?basso music:Immagine ?immagine .\n" +
                        "   ?basso music:suonatoCon ?suonato .\n" +
                        "   ?suonato rdfs:label ?suonatoCon .\n" +
                        "   ?basso music:suonatoIn ?genere . \n" +
                        "   ?genere music:NomeGenereMusicale ?suonatoIn .\n" +
                        "   ?basso music:prodottoDa ?casaProd . \n" +
                        "   ?casaProd music:NomeCasaProduttrice ?prodottoDa .\n" +
                        "   ?basso music:suonatoDa ?suonatoDaURI .\n" +
                        "   ?suonatoDaURI foaf:firstName ?artistaNome .\n" +
                        "   ?suonatoDaURI foaf:lastName ?artistaCognome .\n" +
                        "   BIND(CONCAT(?artistaNome, \" \", ?artistaCognome) AS ?suonatoDa)\n" +
                        "}",
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
            <ResultsH1>Bassi elettrici</ResultsH1>
            {results.map((item) => 
                <Item>
                  <ItemImage src={item.immagine.value}></ItemImage>
                  <ItemDescription>
                    <h1>{item.nome.value}</h1>
                    <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>
                    <hr style={{paddingTop: "3px"}} />
                    <p>Il basso è prodotta dalla casa produttrice: {item.prodottoDa.value}</p>
                    <p>Legni del basso: {item.legni.value}</p>
                    <p>Ponte basso: {item.ponte.value}</p>
                    {item.numCorde != null && <p>Numero corde della basso: {item.numCorde.value}</p>}
                    <p>E' suonata dall'artista: <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                        navigate('/search', {state: {tipo: "Artista", URI: item.suonatoDaURI.value}});
                    }}>{item.suonatoDa.value}</a></p>
                    <p>L'artista {item.suonatoDa.value} suona la "{item.nome.value}" con: "{item.suonatoCon.value}"</p>
                    <p>E' suonato nel genere musicale: {item.suonatoIn.value}</p>
                  </ItemDescription>
                </Item>
            )}
        </ResultsContainer>
    )
}

export default BassoElement
