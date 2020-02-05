## Instructions for restoring Neo4j database
This guidance is used for neo4j version 3.5

### Restore command
A Neo4j database can be restored using the restore command of **neo4j-admin**.

Syntax
```
neo4j-admin restore --from=<backup-directory> [--database=<name>] [--force[=<true|false>]]
```
Options

| Option | Default | Description
| --- | --- | --- |
| --from | | Path to backup to restore from |
| --database | neo4j | Name of database |
| --force | | If an existing database should be replaced|

### Restore a standalone server (single database)
To restore from backups, follow these steps:
1. If the server is running, shut it down.
2. Run **neo4j-admin** restore for every database.
3. Start up the server.

**Example**: Restore the databases system and neo4j from the backups located in **/backup/2019_12_10/graph.db-backup**. Note that the server must be shut down.<br>
First of all, move to neo4j folder. Then, run the following commands
```
./bin/neo4j stop
./bin/neo4j-admin restore --from=/backup/2019_12_10/graph.db-backup --database=neo4j --force
./bin/neo4j start
```

### Restore a cluster
In order to restore in a Causal Cluster, servers in Core Server need to be unbound from the cluster using **neo4j-admin unbind** command.<br>
Unbind command syntax
```
neo4j-admin restore --from=<backup-directory> [--database=<name>] [--force[=<true|false>]]
```
For example, in order to unbind for 1 server in Core Server whose database name is **graph.db**, run the following command
```
neo4j-admin unbind --database=graph.db
```
To restore from a backup in a Causal Cluster, follow these steps:
1. Shut down all database instances in the cluster.
2. Run the **neo4j-admin unbind** command on each of the Core Servers.
3. Restore the backup on each instance, using **neo4j-admin restore**.
4. Start the database instances.
