## Instructions for installing and running Neo4j database
This guidance is used for neo4j version 3.5

## Table of contents
* [Single Database](#single-database)
* [Casual Cluster](#causual-cluster)

## Single Database
First you need to download the tar file of Neo4j from [here](https://neo4j.com/download-center/#community),
this is the community edition which is free of cost there is one more edition enterprise edition
that is not free. The website will provide you the required version for your operating system
so you do not need to choose any version or anything else just click the Download button and
provide the details asked for in that page. After that downloading will start in few seconds.
After that all the steps are described one by one below.

* **Step 1**: <br>
Copy the downloaded file to somewhere where you want to work, after the open you terminal go to that folder by
```cd folderaddress```

```
tar -xf Downloaded file name
like: $ tar -xf neo4j-enterprise-3.5.8-unix.tar.gz
```

* **Step 2**: <br>
Go to neo4j folder, for example
```cd neo4j-enterprise-3.5.8```.<br>
Now to run the neo4j run the below command:
```./bin/neo4j start```

## Casual Cluster

### Configuration
| Option | Description |
| --- | --- |
| dbms.default_listen_address | The address or network interface this machine uses to listen for incoming messages. Setting this value to **0.0.0.0** makes Neo4j bind to all available network interfaces. |
| dbms.default_advertised_address | The address that other machines are told to connect to. In the typical case, this should be set to the fully qualified domain name or the IP address of this server. |
| dbms.mode | The operating mode of a single server instance. For Causal Clustering, there are two possible modes: CORE or READ_REPLICA. |
| causal_clustering.minimum_core_cluster_size_at_formation | The minimum number of Core machines in the cluster at formation. A cluster will not form without the number of Cores defined by this setting, and this should in general be configured to the full and fixed amount. |
| causal_clustering.minimum_core_cluster_size_at_runtime | The minimum number of Core instances which will exist in the consensus group. |
| causal_clustering.initial_discovery_members | The network addresses of an initial set of Core cluster members that are available to bootstrap this Core or Read Replica instance. In the default case, the initial discovery members are given as a comma-separated list of address/port pairs, and the default port for the discovery service is :5000 |

The following example shows how to set up a simple cluster with three Core servers.<br>
In this example, we will configure three Core Servers named ***core01.example.com***, ***core02.example.com*** and ***core03.example.com***. We have already installed Neo4j Enterprise Edition on all three servers. We configure them by preparing **neo4j.conf** on each server. Note that they are all identical, except for the configuration of ***dbms.default_advertised_address***.

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

After the cluster has started, we can connect to any of the instances and run **:sysinfo** to check
the status of the cluster. This will show information about each member of the cluster.

We now have a Neo4j Causal Cluster of three instances running.

### Add a Core Server to an existing cluster
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
### Add a Read Replica to an existing cluster
In this example, we will add a Read Replica, *replica01.example.com*, to the cluster that we created in [Configuration](#configuration). We configure the following entries in **neo4j.conf**.<br>
**neo4j.conf on replica01.example.com**
```
dbms.mode=READ_REPLICA
causal_clustering.discovery_members=core01.example.com:5000,core02.example.com:5000,core03.example.com:5000
```
Now we can start the new Read Replica and let it add itself to the existing cluster.
