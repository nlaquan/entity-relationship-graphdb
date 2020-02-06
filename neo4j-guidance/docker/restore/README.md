## Instructions for backing up Neo4j database with docker
This guidance is used for neo4j version 3.5

**Requirement**: `neo4j-backups` volume must be created in advance<br>
Open terminal, execute the following command:
```
docker run -d \
  -p7474:7474 -p7687:7687 \
  --volume neo4j-backups:/backups:ro \
  -it \
  neo4j:enterprise /bin/bash -c "/var/lib/neo4j/bin/neo4j-admin restore \
  --from=/backups/ --database=$NAME --force; \
  neo4j console"
```
with `$NAME` is the name of folder containning backup data
