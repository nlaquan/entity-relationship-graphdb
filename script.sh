docker run \
    --name neo4j-xyz \
    -p7474:7474 -p7687:7687 -p7473:7474 \
    -d \
    --env=NEO4J_dbms_backup_enabled=true \
    --env=NEO4J_dbms_backup_address=0.0.0.0:6362 \
    --env NEO4J_AUTH=neo4j/test \
    --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
    neo4j:3.5.9-enterprise
