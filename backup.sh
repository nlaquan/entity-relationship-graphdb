docker run --name=neo4j-backup -d \
  -v backup-neo4j:/data \
  --env NEO4J_AUTH=neo4j/test \
  --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
  neo4j:enterprise /bin/bash -c "neo4j-admin backup --from=192.168.25.102:6362 \
    --backup-dir=/data --name=graph.db-2020/02/03"
