## Instructions for working with Neo4j database
This guidance is used for neo4j version 3.5

## Table of contents
* [Install](#install)
* [Backup](#backup)
* [Restore](#restore)

## Install
### Single Database
First you need to download the tar file of Neo4j from [here](https://neo4j.com/download-center/#community),
this is the community edition which is free of cost there is one more edition enterprise edition
that is not free. The website will provide you the required version for your operating system
so you do not need to choose any version or anything else just click the Download button and
provide the details asked for in that page. After that downloading will start in few seconds.
After that all the steps are described one by one below.

* **Step 1**: <br>
Copy the downloaded file to somewhere where you want to work, after the open you terminal go to that folder by
```cd /path/to/folder-that-you-want-to-install-neo4j```

```
tar -xf Downloaded file name
like: $ tar -xf neo4j-enterprise-3.5.8-unix.tar.gz
```

* **Step 2**: <br>
Go to neo4j folder, for example
```cd neo4j-enterprise-3.5.8```.<br>
Now to run the neo4j run the below command:
```./bin/neo4j start```

### Casual Cluster

#### Configuration
| Option | Description |
| --- | --- |
| dbms.default_listen_address | The address or network interface this machine uses to listen for incoming messages. Setting this value to **0.0.0.0** makes Neo4j bind to all available network interfaces. |
| dbms.default_advertised_address | The address that other machines are told to connect to. In the typical case, this should be set to the fully qualified domain name or the IP address of this server. |
| dbms.mode | The operating mode of a single server instance. For Causal Clustering, there are two possible modes: CORE or READ_REPLICA. |
| causal_clustering.minimum_core_cluster_size_at_formation | The minimum number of Core machines in the cluster at formation. A cluster will not form without the number of Cores defined by this setting, and this should in general be configured to the full and fixed amount. |
| causal_clustering.minimum_core_cluster_size_at_runtime | The minimum number of Core instances which will exist in the consensus group. |
| causal_clustering.initial_discovery_members | The network addresses of an initial set of Core cluster members that are available to bootstrap this Core or Read Replica instance. In the default case, the initial discovery members are given as a comma-separated list of address/port pairs, and the default port for the discovery service is :5000 |

The following example shows how to set up a simple cluster with three Core servers.<br>
In this example, we will configure three Core Servers with the respective domain are ***core01.example.com***, ***core02.example.com*** and ***core03.example.com***. We have already installed Neo4j Enterprise Edition on all three servers. We configure them by edit **neo4j.conf** file on each server. Note that they are all identical, except for the configuration of ***dbms.default_advertised_address***.

**neo4j.conf on core01.example.com:**
```
dbms.connectors.default_listen_address=0.0.0.0
dbms.connectors.default_advertised_address=core01.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.initial_discovery_members=core01.example.com:5000,core 02.example.com:5000,core03.example.com:5000
```

**neo4j.conf on core02.example.com:**
```
dbms.connectors.default_listen_address=0.0.0.0
dbms.connectors.default_advertised_address=core02.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.initial_discovery_members=core01.example.com:5000,core 02.example.com:5000,core03.example.com:5000
```

**neo4j.conf on core03.example.com:**
```
dbms.connectors.default_listen_address=0.0.0.0
dbms.connectors.default_advertised_address=core03.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.initial_discovery_members=core01.example.com:5000,core 02.example.com:5000,core03.example.com:5000
```
Now we are ready to start the Neo4j servers. The startup order does not matter.

After the cluster has started, we can connect to any of the instances and run `sysinfo` to check
the status of the cluster. This will show information about each member of the cluster.

We now have a Neo4j Causal Cluster of three instances running.

#### Add a Core Server to an existing cluster
Core Servers are added to an existing cluster by starting a new Neo4j instance with
the appropriate configuration.<br>

The setting *causal_clustering.initial_discovery_members* shall be updated on all the servers
in the cluster to include the new server.<br>

In this example, we will add a Core Server, *core04.example.com*, to the cluster that we created in [Configuration](#configuration). We configure the following entries in **neo4j.conf**.<br>
**neo4j.conf on core04.example.com**
```
dbms.default_listen_address=0.0.0.0
dbms.default_advertised_address=core04.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.discovery_members=core01.example.com:5000,core02.example.com:5000,core03.example.com:5000,core04.example.com:5000
```
Now we can start the new Core Server and let it add itself to the existing cluster.
#### Add a Read Replica to an existing cluster
In this example, we will add a Read Replica with domain: *replica01.example.com*, to the cluster that we created in [Configuration](#configuration). We configure the following entries in **neo4j.conf**.<br>
**neo4j.conf on replica01.example.com**
```
dbms.mode=READ_REPLICA
causal_clustering.discovery_members=core01.example.com:5000,core02.example.com:5000,core03.example.com:5000
```
Now we can start the new Read Replica and let it add itself to the existing cluster.

## Backup
Online backups run against a live Neo4j instance, while offline backups require that the database is shut down.
For more details about offline backups, see [Dump and load databases](#https://neo4j.com/docs/operations-manual/3.5/tools/dump-load/)

The remainder of this chapter is dedicated to describing online backups.
### Standalone databases

#### Configuration parameters
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

### Causal Clusters Backup
#### Configuration parameters
The table below lists the configuration parameters relevant to backup. These parameters are configured in the **neo4j.conf** file.<br>

| Parameter name | Default value | Description |
| --- | --- | --- |
| dbms.backup.enabled | true | Enable support for running online backups. |
| dbms.backup.address | 127.0.0.1:6362-6372 | Listening server for online backups. |
| dbms.backup.backup_policy |  | The SSL policy used on the backup port. |

#### Encrypted backups
Encrypted backups are available with Causal Clustering.<br>
Both the server running the backup, and the backup target, must be configured with the same SSL policy. The policy to be used for encrypting backup traffic must be assigned on both servers. (see Section 5.4, “Intra-cluster encryption”)

## Restore
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
1. If Neo4j instance is running, shut it down.
2. Run **neo4j-admin** restore.
3. Start up the Neo4j instance.

**Example**: Restore the databases system and neo4j from the backups located in **/backup/2019_12_10/graph.db-backup**.<br>
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

