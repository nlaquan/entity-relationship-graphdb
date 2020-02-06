## Instructions for backing up Neo4j database with docker
This guidance is used for neo4j version 3.5

In order to back up Neo4j database, follow these steps:
1. Create volume named 'neo4j-backups' in docker by using the following command:
```
docker volume create neo4j-backups
```
2. Open terminal, execute the following command:
```
docker run -d \
  --volume neo4j-backups:/data \
  --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
  neo4j:enterprise /bin/bash -c "neo4j-admin backup --from=$IP \
    --backup-dir=/data --name=$NAME"
```
with `$IP` is the IP/domain of backup server, `$NAME` is the name of folder containning backup data
