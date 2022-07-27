# progettoModSem
Progetto in RDF/OWL Ontology per il corso di Modellazzione Concetuale per il Web Semantico - Unito 2022.

## Descrizione progetto

E' stata sviluppata un'ontologia (limitata) in RDF/OWL sugli strumenti musicali. Inoltre è stata creata un'applicazione client che con query SPARQL utilizza
l'ontologia. 

Il dominio di applicazione riguarda il fornire agli utenti, appassionati 
di musica, tutte le informazioni sugli strumenti musicali, sugli artisti 
che suonano lo strumento musicale, sulle case produttrici degli 
strumenti musicali e sulle band musicali (o solisti) in cui gli artisti 
suonano.

## Come eseguire l'applicazione client

Installare GraphDB da https://graphdb.ontotext.com/.

Una volta installato GraphDB, caricare l'ontologia importando il file 'musical-instruments.owl' dal menù di sinistra 'Import'.

Una volta importata l'ontologia, spostarsi nella cartella del client:
```
cd music-client
```

Installare i moduli necessari:
```
yarn install
```

Infine eseguire:
```
yarn start
```
