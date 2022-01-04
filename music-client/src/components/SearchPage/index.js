import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
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

/* Codice per la pagina di ricerca URI per collegare gli artisti, strumenti, case produttrici e band musicali */

const SearchElement = () => {
    const [results, setResults] = useState([]);
    const [state, setState] = useState(useLocation().state);

    /* useEffect serve per eseguire il codice solo una volta */
    useEffect(() => {
        let query = null;
        /* A seconda del tipo di URI, cioè se è un'artista o una casa produttrice o strumento musicale o band musicale viene creata la SPARQL Query */
        if (state.tipo === 'Artista') {
            query =  "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX mo: <http://purl.org/ontology/mo/>\n" +
                    "SELECT ?nome ?cognome ?eta ?genere ?dataNascita ?tipoGruppo ?gruppoURI ?gruppo ?immagine (group_concat(distinct ?strumentoMusicaleURI;separator=\", \") AS ?suonaURI) (group_concat(distinct ?strumento;separator=\", \") AS ?suona) (group_concat(distinct ?oggetto;separator=\", \") AS ?utilizza)\n" +
                    "WHERE {\n" +
                    "    <" + state.URI + ">  ?p  ?o .\n" +
                    "    ?o foaf:firstName ?nome .\n" +
                    "   ?o foaf:lastName ?cognome .\n" +
                    "   ?o foaf:birthday ?dataNascita .\n" +
                    "   ?o foaf:age ?eta .\n" +
                    "   ?o foaf:gender ?genere .\n" +
                    "   ?o music:Immagine ?immagine .\n" +
                    "   ?o music:suona ?strumentoMusicaleURI .\n" +
                    "   ?strumentoMusicaleURI music:NomeStrumentoMusicale ?strumento .\n" +
                    "   ?o music:lavoraIn ?gruppoURI .\n" +
                    "   ?gruppoURI music:NomeBandMusicale ?gruppo .\n" +
                    "   ?gruppoURI rdf:type ?tipoBand .\n" +
                    "   ?tipoBand rdfs:label ?tipoGruppo .\n" +
                    "   FILTER(?tipoBand IN (mo:MusicGroup, mo:SoloMusicArtist))\n" +
                    "   optional {\n" +
                    "       ?o music:utilizza ?oggettoURI .\n" +
                    "       ?oggettoURI rdfs:label ?oggetto\n" +
                    "    }\n" +
                    "}\n" +
                    "GROUP BY ?nome ?cognome ?eta ?genere ?dataNascita ?gruppo ?immagine ?tipoGruppo ?gruppoURI";
        } else if (state.tipo === 'CasaProduttrice') {
            query =  "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                     "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                     "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                     "select ?nome ?descrizione ?immagine ?fondataNel ?origineTipo ?citta (group_concat(distinct ?strumentoMusicaleURI;separator=\", \") AS ?suonaURI) (group_concat(distinct ?prod;separator=\", \") AS ?produce) where { \n" +
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
                     "       ?o music:produce ?strumentoMusicaleURI .\n" +
                     "       ?strumentoMusicaleURI music:NomeStrumentoMusicale ?prod\n" +
                     "   }\n" +
                     "   optional {\n" +
                     "       ?o music:producePezzi ?strumentoMusicaleURI .\n" +
                     "       ?strumentoMusicaleURI music:NomeStrumentoMusicale ?prod\n" +
                     "   }\n" +
                     "}\n" +
                     "GROUP BY ?nome ?descrizione ?immagine ?fondataNel ?origineTipo ?citta";
        } else if (state.tipo === 'StrumentoMusicale') {
            query =     "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                        "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                        "PREFIX mo: <http://purl.org/ontology/mo/>\n" +
                        "select ?nome ?immagine ?commento ?descrizione ?numCorde ?body ?ponte ?legni ?prodottoDaFustiURI ?prodottoDaFusti ?fustiNome ?piattiNome ?produzionePiattiURI ?suonatoDaURI ?suonatoCon ?suonatoIn ?prodottoDaURI ?produzionePiatti ?prodottoDa ?suonatoDa where { \n" +
                        "    <" + state.URI + "> ?p ?o .\n" +
                        "    ?o rdf:type mo:Instrument .\n" +
                        "    ?o rdfs:comment ?commento .\n" +
                        "    optional {?o music:DescrizioneStrumento ?descrizione} .\n" +
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
        } else if (state.tipo === 'Band') {
            query =  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                    "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" +
                    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n" +
                    "PREFIX mo: <http://purl.org/ontology/mo/>\n" +
                    "SELECT DISTINCT ?descrizione ?nome ?numArtisti ?nomeTipoBand ?immagine (group_concat(distinct ?artistiURI;separator=\", \") AS ?artistiNomeURI) (group_concat(distinct ?artisti;separator=\", \") AS ?artistiNome) where {\n" +
                    "    <" + state.URI + "> ?p ?o .\n" +
                    "    ?o rdfs:comment ?descrizione .\n" +
                    "    ?o rdf:type ?tipoBand .\n" +
                    "    FILTER(?tipoBand IN (mo:MusicGroup, mo:SoloMusicArtist)) .\n" +
                    "    ?tipoBand rdfs:label ?nomeTipoBand .\n" +
                    "    ?o music:NomeBandMusicale ?nome .\n" +
                    "    ?o music:HaNumeroArtisti ?numArtisti .\n" +
                    "    ?o music:Immagine ?immagine .\n" +
                    "    ?citta rdf:type ?origineTipo .\n" +
                    "    ?o music:haLavoratori ?artistiURI .\n" +
                    "    ?artistiURI foaf:firstName ?artistaNome .\n" +
                    "    ?artistiURI foaf:lastName ?artistaCognome .\n" +
                    "   BIND(CONCAT(?artistaNome, \" \", ?artistaCognome) AS ?artisti)\n" +
                    "}\n" +
                    "GROUP BY ?descrizione ?nome ?numArtisti ?immagine ?nomeTipoBand";
        }

        const requestData = {
            query:  query,
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
    }, [state]);

    /* 
        A seconda del tipo di URI, cioè se è un'artista o una casa produttrice o strumento musicale o band musicale
        vengono restituiti i componenti e le informazioni relative.
    */
    if (state.tipo === 'Artista') {
        if (results != null) {
            return (
                <ResultsContainer>
                <ResultsH1>Ricerca IRI</ResultsH1>
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
                            <p>{item.nome.value + " " + item.cognome.value} utilizza:
                                <ul>
                                    {/* Effettuo un ciclo sull'array degli strumenti per creare l'elenco, con ogni strumento linkato. */}
                                    {strumenti.map((strumento, i) => 
                                        <li>
                                            <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                    e.preventDefault();
                                                    setState({tipo: "StrumentoMusicale", URI: strumentiURI[i]});
                                                    setResults(null);
                                                }}>{strumento}
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </p>
                            {item.utilizza.value !== '' && <p>{item.nome.value + " " + item.cognome.value} suona con: "{item.utilizza.value}"</p>}
                            {/* Se è un solista restituisce un certo paragrafo, altrimenti un altro. Il gruppo dove suona sarà linkato. */}
                            {item.tipoGruppo.value === 'Solista' && <p>Suona come solista e si fa chiamare: "<a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setState({tipo: "Band", URI: item.gruppoURI.value});
                                                                            setResults(null);
                                                                        }}>{item.gruppo.value}
                                                                    </a>"
                                                              </p>}
                        {item.tipoGruppo.value === 'Gruppo' && <p>Suona nella band musicale: "<a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setState({tipo: "Band", URI: item.gruppoURI.value});
                                                                            setResults(null);
                                                                        }}>{item.gruppo.value}
                                                                    </a>"
                                                              </p>}
                        </ItemDescription>
                        </Item>
                    )
                })}
            </ResultsContainer>
            )
        }
        return <ResultsContainer />;
    } else if (state.tipo === 'CasaProduttrice') {
        if (results != null) {
            return (
                /* Rendering di tutti i componenti */
                <ResultsContainer>
                    <ResultsH1>Ricerca IRI</ResultsH1>
                    {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
                    {results.map((item) => {
                        /* Preparo gli array nel caso in cui le case produttrici producano più di uno strumento */
                        const strumenti = item.produce.value.split(", ");
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
                                {/* Restituisco le informazioni della casa produttrice. */}
                                <h1>{item.nome.value}</h1>
                                <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>
                                <hr style={{paddingTop: "3px"}} />
                                <p>Data fondazione: {item.fondataNel.value}</p>
                                <p>Origine: {item.origineTipo.value === "CittaAmericana" ? "Americana" : "Giapponese"}</p>
                                <p>Sede principale: {item.citta.value}</p>
                                <p>{item.nome.value} produce:
                                    <ul>
                                        {/* Effettuo un ciclo sull'array degli strumenti per creare l'elenco, con ogni strumento linkato. */}
                                        {strumenti.map((strumento, i) => 
                                            <li>
                                                <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                        e.preventDefault();
                                                        setState({tipo: "StrumentoMusicale", URI: strumentiURI[i]});
                                                        setResults(null);
                                                    }}>{strumento}
                                                </a>
                                            </li>
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
        return <ResultsContainer />;
    } else if (state.tipo === 'StrumentoMusicale') {
        if (results != null) {
            return (
                /* Rendering di tutti i componenti */
                <ResultsContainer>
                    <ResultsH1>Ricerca IRI</ResultsH1>
                    {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
                    {results.map((item) => 
                        <Item>
                        <ItemImage src={item.immagine.value}></ItemImage>
                        <ItemDescription>
                            {/* 
                                Restituisco le informazioni dello strumento musicale, controllando se la proprietà esiste
                                e linkando le varie informazioni che lo necessitano.
                            */}
                            <h1>{item.nome.value}</h1>
                            <p style={{marginBottom: "0px"}}>{item.descrizione !== undefined ? item.descrizione.value : item.commento.value}</p>
                            <hr style={{paddingTop: "3px"}} />
                            {item.prodottoDa !== undefined && <p>E' prodotto dalla casa produttrice: <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                        e.preventDefault();
                                        setState({tipo: "CasaProduttrice", URI: item.prodottoDaURI.value});
                                        setResults(null);
                            }}>{item.prodottoDa.value}</a></p>}
                            {item.body !== undefined && <p>Body: {item.body.value}</p>}
                            {item.legni !== undefined && <p>Legni: {item.legni.value}</p>}
                            {item.ponte !== undefined &&<p>Ponte: {item.ponte.value}</p>}
                            {item.numCorde !== undefined && <p>Numero corde: {item.numCorde.value}</p>}
                            {item.prodottoDaFusti !== undefined &&<p>La batteria è composta da: 
                                <ul>
                                    <li>Fusti: {item.fustiNome.value} - Prodotti da: <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                        e.preventDefault();
                                        setState({tipo: "CasaProduttrice", URI: item.prodottoDaFustiURI.value});
                                        setResults(null);
                            }}>{item.prodottoDaFusti.value}</a></li>
                                    <li>Piatti: {item.piattiNome.value} - Prodotti da: <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                        e.preventDefault();
                                        setState({tipo: "CasaProduttrice", URI: item.produzionePiattiURI.value});
                                        setResults(null);
                            }}>{item.produzionePiatti.value}</a></li>
                                </ul>    
                            </p>}
                            <p>E' suonata dall'artista: <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                e.preventDefault();
                                setState({tipo: "Artista", URI: item.suonatoDaURI.value});
                                setResults(null);
                            }}>{item.suonatoDa.value}</a></p>
                            {item.suonatoCon !== undefined &&<p>L'artista {item.suonatoDa.value} suona la "{item.nome.value}" con: "{item.suonatoCon.value}"</p>}
                            <p>E' suonato nel genere musicale: {item.suonatoIn.value}</p>
                        </ItemDescription>
                        </Item>
                    )}
                </ResultsContainer>
            )
        }
        return <ResultsContainer />;
    } else if (state.tipo === 'Band') {
        if (results != null) {
            return(
                /* Rendering di tutti i componenti */
                <ResultsContainer>
                    <ResultsH1>Ricerca IRI</ResultsH1>
                    {/* Effettuo un ciclo sull'array dei risultati dove per ogni elemento mi restituisce i componenti */}
                    {results.map((item) => {
                        /* Preparo gli array perchè ci sono più artisti che suonano nel gruppo musicale */
                        const artisti = item.artistiNome.value.split(", ");
                        const artistiURI = item.artistiNomeURI.value.split(", ");
                        let nome = null;
                        let desc = null;
                        /* Preparo gli array dividendo il nome dalla descrizione che la segue, così posso linkare il nome dell'artista. */
                        if (item.nomeTipoBand.value === 'Solista') {
                            let nomeArray = item.descrizione.value.split(" ");
                            nome = nomeArray.slice(0, 2).join(" ");
                            desc = nomeArray.slice(2, nomeArray.length).join(" ");
                        }
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
                                {/* Restituisco le informazioni del gruppo musicale o del solista. */}
                                <h1>{item.nome.value}</h1>
                                {item.nomeTipoBand.value === 'Gruppo' && <p style={{marginBottom: "0px"}}>{item.descrizione.value}</p>}
                                <hr style={{paddingTop: "3px"}} />
                                {item.nomeTipoBand.value === 'Gruppo' && <p>Nella band musicale "{item.nome.value}" suonano {item.numArtisti.value} artisti:
                                    <ul>
                                        {/* Effettuo un ciclo sull'array degli artisti per creare l'elenco, con ogni artista linkato. */}
                                        {artisti.map((artista, i) => 
                                            <li>
                                                <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                        e.preventDefault();
                                                        setState({tipo: "Artista", URI: artistiURI[i]});
                                                        setResults(null);
                                                    }}>{artista}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </p>}
                                {item.nomeTipoBand.value === 'Solista' &&
                                    <p>
                                        <a href="/#" style={{color: 'black'}} onClick={(e) => {
                                                                e.preventDefault();
                                                                setState({tipo: "Artista", URI: item.artistiNomeURI.value});
                                                                setResults(null);
                                                            }}>{nome}</a>{" " + desc}
                                    </p>
                                }
                            </ItemDescription>
                            </Item>
                        )
                    })}
                </ResultsContainer>
            )
        }
        return <ResultsContainer />;   
    }
}

export default SearchElement