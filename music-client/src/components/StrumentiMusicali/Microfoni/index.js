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

const MicrofonoElement = () => {

    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        const requestData = {
          query: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" + 
                "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" + 
                "SELECT ?microfono ?nome ?descrizione ?suonatoDaURI ?suonatoDa ?suonatoIn ?prodottoDaURI ?prodottoDa ?immagine where {\n" + 
                "?microfono music:suonatoDa ?suonatoDaURI .\n" + 
                "?microfono rdf:type music:Microfono .\n" + 
                "?suonatoDaURI foaf:firstName ?suonatoNome .\n" + 
                "?suonatoDaURI foaf:lastName ?suonatoCognome .\n" + 
                "BIND(CONCAT(?suonatoNome, \" \", ?suonatoCognome) AS ?suonatoDa) .\n" + 
                "?microfono music:NomeStrumentoMusicale ?nome .\n" +
                "?microfono music:DescrizioneStrumento ?descrizione .\n" +
                "?microfono music:suonatoIn ?suonatoGenere .\n" +
                "?microfono music:prodottoDa ?prodottoDaURI .\n" +
                "?prodottoDaURI music:NomeCasaProduttrice ?prodottoDa .\n" +
                "?suonatoGenere music:NomeGenereMusicale ?suonatoIn .\n" + 
                "?microfono music:Immagine ?immagine .\n}",
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
            <ResultsH1>Microfoni</ResultsH1>
            {results.map((item) => 
                <Item>
                  <ItemImage src={item.immagine.value}></ItemImage>
                  <ItemDescription>
                    <h1>{item.nome.value}</h1>
                    <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>
                    <hr style={{paddingTop: "3px"}} />
                    <p>E' prodotto dalla casa produttrice: <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                        navigate('/search', {state: {tipo: "CasaProduttriceMicrofono", URI: item.prodottoDaURI.value}});
                    }}>{item.prodottoDa.value}</a></p>
                    <p>E' utilizzato dall'artista: <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                        navigate('/search', {state: {tipo: "Artista", URI: item.suonatoDaURI.value}});
                    }}>{item.suonatoDa.value}</a></p>
                    <p>E' utilizzato nel genere musicale: {item.suonatoIn.value}</p>
                  </ItemDescription>
                </Item>
            )}
        </ResultsContainer>
    )
}

export default MicrofonoElement
