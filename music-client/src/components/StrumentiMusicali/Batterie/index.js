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

const BatteriaElement = () => {
    const [results, setResults] = useState([]);

    useEffect( () => {
        const requestData = {
            query:  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + 
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "SELECT ?batteria ?nome ?immagine ?descrizione ?suonatoIn ?fustiNome ?produzioneFusti ?piattiNome ?produzionePiatti ?suonatoDa ?suonatoCon\n" +
                        "WHERE { ?batteria rdf:type music:Batteria .\n" +
                            "?batteria music:DescrizioneStrumento ?descrizione .\n" +
                            "?batteria music:Immagine ?immagine .\n" +
                            "?batteria music:NomeStrumentoMusicale ?nome .\n" +
                            "?batteria music:suonatoCon ?suonato .\n" +
                            "?suonato rdfs:label ?suonatoCon .\n" +
                            "?batteria music:suonatoIn ?genere . \n" +
                            "?genere music:NomeGenereMusicale ?suonatoIn .\n" +
                            "?batteria music:suonatoDa ?artista .\n" +
                            "?artista foaf:firstName ?artistaNome .\n" +
                            "?artista foaf:lastName ?artistaCognome .\n" +
                            "BIND(CONCAT(?artistaNome, \" \", ?artistaCognome) AS ?suonatoDa) .\n" +
                            "?batteria music:compostoDa ?fusti .\n" +
                            "?fusti music:NomeStrumentoMusicale ?fustiNome .\n" +
                            "?fusti rdf:type music:TuttiFusti .\n" +
                            "?fusti music:pezziProdottiDa ?fustiCasaProd . \n" +
                            "?fustiCasaProd music:NomeCasaProduttrice ?produzioneFusti .\n" +
                            "?batteria music:compostoDa ?piatti .\n" +
                            "?piatti music:NomeStrumentoMusicale ?piattiNome . \n" +
                            "?piatti rdf:type music:Piatti .\n" +
                            "?piatti music:pezziProdottiDa ?piattiCasaProd . \n" +
                            "?piattiCasaProd music:NomeCasaProduttrice ?produzionePiatti\n" +
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
            <ResultsH1>Batterie</ResultsH1>
            {results.map((item) => 
                <Item>
                  <ItemImage src={item.immagine.value}></ItemImage>
                  <ItemDescription>
                    <h1>{item.nome.value}</h1>
                    <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>
                    <hr style={{paddingTop: "3px"}} />
                    <p>La batteria è composta da: 
                        <ul>
                            <li>Fusti: {item.fustiNome.value} - Prodotti da: {item.produzioneFusti.value}</li>
                            <li>Piatti: {item.piattiNome.value} - Prodotti da: {item.produzionePiatti.value}</li>
                        </ul>    
                    </p>
                    <p>E' suonata dall'artista: {item.suonatoDa.value}</p>
                    <p>L'artista {item.suonatoDa.value} suona la "{item.nome.value}" con: "{item.suonatoCon.value}"</p>
                    <p>E' suonato nel genere musicale: {item.suonatoIn.value}</p>
                  </ItemDescription>
                </Item>
            )}
        </ResultsContainer>
    )
}

export default BatteriaElement
