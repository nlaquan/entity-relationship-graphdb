## Instructions for backing up Neo4j database
This guidance is used for neo4j version 3.5

### Configuration parameters
The table below lists the configuration parameters relevant to backup. These parameters are configured in the **neo4j.conf** file.<br>

| Parameter name | Default value | Description |
| --- | --- | --- |
| dbms.backup.enabled | true | Enable support for running online backups. |
| dbms.backup.address | 127.0.0.1:6362-6372 | Listening server for online backups. |

### Backup online process
Backup online process follow these steps:<br>
1. Backup server need to be configured with parameters shown in the above table.
2. From another computer - called backup client. Open terminal and move the neo4j folder, execute *neo4j-admin backup* command. The data to be backed up will be stored on the backup client.

### Backup online command
Syntax
```
neo4j-admin backup --backup-dir=<backup-path> --name=<graph.db-backup>
                    [--from=<address>] [--protocol=<any|catchup|common>]
                    [--fallback-to-full[=<true|false>]]
                    [--pagecache=<pagecache>]
                    [--timeout=<timeout>]
                    [--check-consistency[=<true|false>]]
                    [--additional-config=<config-file-path>]
                    [--cc-graph[=<true|false>]]
                    [--cc-indexes[=<true|false>]]
                    [--cc-label-scan-store[=<true|false>]]
                    [--cc-property-owners[=<true|false>]]
                    [--cc-report-dir=<directory>]
```
Options<br>

| Option | Default | Description |
| --- | --- | --- |
| protocol | any | Protocol over which to perform backup. If set to **any**, then **catchup** will be tried first. If that fails, then it will attempt to fall back to **common**. It is recommended to set this option explicitly. Set it to **catchup** for Causal Cluster backups, and to **common** for HA or single-instance backups. |
| backup-dir | | Directory to place backup in. |
| name | | Name of backup. |
| from | localhost:6362 | Host and port of backup server |

For other parameters please refer to the neo4j [docs](https://neo4j.com/docs/operations-manual/3.5/backup/performing/)

### Example
Assuming backup server is configured with the following parameters:
```
dbms.backup.enabled=true
dbms.backup.address=backup-server@example.com
```
On the backup client, go to neo4j folder and run the following command:
```
neo4j-admin backup
  --protocol=any
  --from=backup-server@example.com
  --backup-dir=03/02/2020
  --name=graph.db-graph
```
