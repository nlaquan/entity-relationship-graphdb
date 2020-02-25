## Data simulation

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This project generate data for querying and archiving performance tests for relational entity storage problems.

## Technologies
This project use [Nodejs](https://nodejs.org/en/).

## Setup
* Installing ```yarn``` in advance.
* In order to generate data simulation, execute the following commands
```
yarn install
node src/index path/to/configuration/file
```

* After the command completes, copy the entire the subdirectory of the directory ```import```
to the folder ```import``` of project folder neo4j
* Copy ```script.sh``` file to the project folder neo4j
* Then, open terminal from current neo4j folder, run the following command:
```
chmod +x script.sh
```
* Finally, run the following command:
```
./script.sh
```
