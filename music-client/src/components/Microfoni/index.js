import React from 'react'

const Microfono = () => {

    const requestData = {
        query: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
               "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" + 
               "PREFIX music: <http://www.semanticweb.org/musical-instruments#>\n" + 
               "SELECT ?microfono ?p ?o where {\n" + 
               "?microfono rdf:type music:Microfono .\n" + 
               "?microfono ?p ?o .\n" +
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
    .then(data => console.log(data));

    return (
        <div>
            <h1>Ciao!</h1>
            <h1>Ciao!</h1>
            <h1>Ciao!</h1>
            <h1>Ciao!</h1>
            <h1>Ciao!</h1>
        </div>
    )
}

export default Microfono
