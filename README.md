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

## Come visualizzare l'ontologia

Installare Protégé da https://protege.stanford.edu/ e caricare l'ontologia.

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


## Video esecuzione del progetto

<a href="http://www.youtube.com/watch?feature=player_embedded&v=5g7Gs0sNL4U
" rel="noopener" target="_blank"><img src="http://img.youtube.com/vi/5g7Gs0sNL4U/0.jpg" 
alt="Esecuzione ModSem" width="400" border="10" /></a>
