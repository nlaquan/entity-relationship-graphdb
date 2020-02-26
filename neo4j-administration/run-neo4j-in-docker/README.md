## Instructions for working with Neo4j database with docker
This guidance is used for neo4j version 3.5

## Table of contents
* [Innstall](#install)
* [Backup](#backup)
* [Restore](#restore)

## Install
### Neo4j configuration
The Neo4j Docker image includes some basic configuration defaults that should not need adjustment for most cases. However, if interested, the full list of default configurations for Neo4j in Docker can be found on the GitHub [repository](https://github.com/neo4j/docker-neo4j/blob/master/docker-image-src/3.5/docker-entrypoint.sh).<br>
By default, the Docker image exposes three ports for remote access:
* `7474` for HTTP
* `7473` for HTTPS
* `7687` for Bolt
We will use these ports to connect to Neo4j inside the container, accessing it from Neo4j Browser, an application, or other methods.<br>
There are three ways to modify the configuration:
* Set environment variables.
* Mount a /conf volume.
* Build a new image.

#### Set enviroment variables
Pass environment variables to the container when you run it. For example:
```
docker run \
    --detach \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    --volume=$HOME/neo4j/logs:/logs \
    --env NEO4J_dbms_memory_pagecache_size=4G \
    neo4j:3.5.9-enterprise
```
With above command `NEO4J_dbms_memory_pagecache_size=4G` is a Neo4j configuration. Any configuration value ([Configuration settings](https://neo4j.com/docs/operations-manual/current/reference/configuration-settings/)) can be passed using the following naming scheme:
* Prefix with NEO4J_.
* Underscores must be written twice: _ is written as __.
* Periods are converted to underscores: . is written as _.
As an example, dbms.tx_log.rotation.size could be set by specifying the following argument to Docker:
```
--env NEO4J_dbms_tx__log_rotation_size
```
##### Neo4j Enterprise Edition
The following environment variables are specific to Causal Clustering, and are available in the Neo4j Enterprise Edition:
* `NEO4J_dbms_mode:` the database mode, defaults to `SINGLE`, set to `CORE` or `READ_REPLICA` for Causal Clustering.
* `NEO4J_causal__clustering_expected__core__cluster__size`: the initial cluster size (number of Core instances) at startup.
* `NEO4J_causal__clustering_initial__discovery__members`: the network addresses of an initial set of Core cluster members.
* `NEO4J_causal__clustering_discovery__advertised__address`: hostname/ip address and port to advertise for member discovery management communication.
* `NEO4J_causal__clustering_transaction__advertised__address`: hostname/ip address and port to advertise for transaction handling.
* `NEO4J_causal__clustering_raft__advertised__address`: hostname/ip address and port to advertise for cluster communication.
#### Mount a /conf volume
To make arbitrary modifications to the Neo4j configuration, provide the container with a /conf volume.
```
docker run \
    --detach \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    --volume=$HOME/neo4j/logs:/logs \
    --volume=$HOME/neo4j/conf:/conf \
    neo4j:3.5.9-enterprise
```
Any configuration files in the `/conf` volume will override files provided by the image. So if you want to change one value in a file you must ensure that the rest of the file is complete and correct. Environment variables passed to the container by Docker will still override the values in configuration files in `/conf` volume.

#### Build a new image
See [docs](https://neo4j.com/docs/operations-manual/current/docker/configuration/#docker-new-image) for more information.

### Single Database
Retrieving and running Neo4j within a Docker container is very simple using one of the provided images. We will need to execute the basic `docker run` command with the neo4j image and specify any options or versions we want along with that. Let us take a look at a few options available with the `docker run` command.

| Option | Description | Example |
| --- | --- | --- |
| --name | Name your container (avoids generic id) | `docker run --name name-of-container-what-you-want neo4j` |
| -p | Specify container ports to expose | `docker run -p7687:7687 neo4j` |
| -d | Detach container to run in background | `docker run -d neo4j` |
| -v | Bind mount a volume | `docker run -v $HOME/neo4j/data:/data neo4j` |
| --env | Set config as environment variables for Neo4j database | `docker run --env NEO4J_AUTH=neo4j/test` |
| --help | Output full list of docker run options | `docker run --help` |

By default, Neo4j requires authentication and requires us to first login with `neo4j/neo4j` and set a new password. We will skip this password reset by initializing the password when we create the Docker container using the `--env NEO4J_AUTH=neo4j/<password>` option.<br>
For example, run the following command:
```
docker run \
    --name testneo4j \
    -p7474:7474 -p7687:7687 \
    -d \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/import:/var/lib/neo4j/import \
    -v $HOME/neo4j/plugins:/plugins \
    --env NEO4J_AUTH=neo4j/test \
    neo4j:3.5.9-enterprise
```
With the above command:
* Create and start a container named `testneo4j`
* We have `-d`. This detaches the container to run in the background, meaning we can access the container separately and see into all of its processes.
* With the `-v` option. These lines define volumes we want to bind in our local directory structure so we can access certain files locally. (For more information about Docker **bind mount**, visit docker [docs](https://docs.docker.com/storage/bind-mounts/)).
  - The first one is for our /data directory, which stores the authentication and roles for each database, as well as the actual data contents of each database instance (in graph.db folder).
  - The second -v option is for the /logs directory. Outputting the Neo4j logs to a place outside the container ensures we can troubleshoot any errors in Neo4j, even if the container crashes.
  - The third line with the -v option binds the import directory, so we can copy CSV or other flat files into that directory for importing into Neo4j. Load scripts for importing that data can also be placed in this folder for us to execute.
  - The next -v option line sets up our plugins directory. If we want to include any custom extensions or add the Neo4j APOC or graph algorithms library, exposing this directory simplifies the process of copying the jars for Neo4j to access.
* With the `--env` parameter, we initiate our Neo4j instance with a username and password. Neo4j automatically sets up basic authentication with the `neo4j` username as a foundation for security. Since it will initiate authentication and require a password change when first connecting, we can handle all of that in this parameter.
* Finally, the last line of the command above references the Docker image we want to pull from DockerHub (`neo4j`), as well as any specified version (in this case, just the `3.5.9-enterprise` edition).

When we run this command, it will create and start the container.<br>
Once we execute the command above, Neo4j should be running in our Docker container! You can verify this by running `docker ps.`

### Cluster
The following example shows how to set up a cluster with three Core servers with Docker.<br>

#### Example
In this example, we will configure three Core Servers with the respective domain are ***core01.example.com***, ***core02.example.com*** and ***core03.example.com***.<br>
Run the following command for each server
```
docker run --name=$NAME_OF_CONTAINER --detach \
  --network=host \
  --env NEO4J_dbms_mode=CORE \
  --env NEO4J_causal__clustering_expected__core__cluster__size=$EXPECTED_CORE_CLUSTER_SIZE \
  --env NEO4J_causal__clustering_initial__discovery__members=$INITIAL_CORE_MEMBERS \
  --env NEO4J_causal__clustering_discovery__advertised__address=$ADDRESS:5000 \
  --env NEO4J_causal__clustering_transaction__advertised__address=$ADDRESS:6000 \
  --env NEO4J_causal__clustering_raft__advertised__address=$ADDRESS:7000 \
  --env NEO4J_dbms_connectors_default__advertised__address=$ADDRESS \
  --env NEO4J_dbms_connector_bolt_advertised__address=$ADDRESS:7687 \
  --env NEO4J_dbms_connector_http_advertised__address=$ADDRESS:7474 \
  --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
  neo4j:enterprise
```
In which:
* `$NAME_OF_CONTAINER` is the name of container.
* `$EXPECTED_CORE_CLUSTER_SIZE` is the the expected core cluster size. The default value is 3 and the minimum value is 2. (see [configuration-settings](https://neo4j.com/docs/operations-manual/current/reference/configuration-settings/) for more information)
* `$ADDRESS` is the IP address or domain of the each server: ***core01.example.com***, ***core02.example.com*** and ***core03.example.com***

After the cluster has started, we can connect to any of the instances and run **:sysinfo** to check the status of the cluster. This will show information about each member of the cluster. We now have a Neo4j Causal Cluster of three instances running.

## Backup
In order to back up Neo4j database, follow these steps:


1. Create volume named `neo4j-backups` in docker by using the following command:
```
docker volume create neo4j-backups
```
2. Open terminal, execute the following command:
```
docker run neo4j_backup -d \
  --v neo4j-backups:/data \
  --v $HOME/neo4j/logs:/logs \
  --v $HOME/neo4j/import:/var/lib/neo4j/import \
  --v $HOME/neo4j/plugins:/plugins \
  --env NEO4J_AUTH=neo4j/test \
  --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
  neo4j:3.5.9-enterprise /bin/bash -c "neo4j-admin backup --from=$ADDRESS \
    --backup-dir=/data --name=$NAME"
```
in which `$ADDRESS` is the IP/domain of backup server, `$NAME` is the name of backup data.<br>
With the above command:
* Create and start a container named `neo4j_backup`
* With the `-v` option. These lines define volumes we want to mount (bind mount/volume) in our local directory structure so we can access certain files locally. (For more information about Docker **bind mount**, visit docker [docs](https://docs.docker.com/storage/bind-mounts/); **volume** visit docker [docs](https://docs.docker.com/storage/volumes/)).
  - The first one is for our /data directory.
  - The second -v option is for the /logs directory. Outputting the Neo4j logs to a place outside the container ensures we can troubleshoot any errors in Neo4j, even if the container crashes.
  - The third line with the -v option binds the import directory, so we can copy CSV or other flat files into that directory for importing into Neo4j. Load scripts for importing that data can also be placed in this folder for us to execute.
  - The next -v option line sets up our plugins directory. If we want to include any custom extensions or add the Neo4j APOC or graph algorithms library, exposing this directory simplifies the process of copying the jars for Neo4j to access.
* With the `--env` parameter, we initiate our Neo4j instance with a username and password. Neo4j automatically sets up basic authentication with the `neo4j` username as a foundation for security. Since it will initiate authentication and require a password change when first connecting, we can handle all of that in this parameter.
* Finally, the last line of the command above references the Docker image we want to pull from DockerHub (`neo4j`), as well as any specified version (in this case, just the `3.5.9-enterprise` edition) and the command will be executed when the container running: *bin/bash -c "neo4j-admin backup --from=$ADDRESS \
    --backup-dir=/data --name=$NAME* - this command will make data backup.
## Restore
**Requirement**: `neo4j-backups` volume must be created in advance<br>
Open terminal, execute the following command:
```
docker run --name neo4j -d \
  -p7474:7474 -p7687:7687 \
  --volume neo4j-backups:/backups:ro \
  --volume $HOME/neo4j/data:/data \
  --volume $HOME/neo4j/logs:/logs \
  --volume $HOME/neo4j/import:/var/lib/neo4j/import \
  --volume $HOME/neo4j/plugins:/plugins \
  --env NEO4J_AUTH=neo4j/test \
  --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
  neo4j:3.5.9-enterprise /bin/bash -c "/var/lib/neo4j/bin/neo4j-admin restore \
  --from=/backups/ --database=$NAME --force; \
  neo4j console"
```
in which `$NAME` is the name of backup data<br>
With the above command:
* Create and start a container named `neo4j`
* With the `-v` option. These lines define volumes we want to mount (bind mount/volume) in our local directory structure so we can access certain files locally. (For more information about Docker **bind mount**, visit docker [docs](https://docs.docker.com/storage/bind-mounts/); **volume** visit docker [docs](https://docs.docker.com/storage/volumes/)).
  - The first one is for mounting `neo4j-backups` volume (which has backup data) to `backups` folder in container (`:ro` at the end of this line mean container can't writing data to `backups` folder)
  - The second -v option is for the /logs directory. Outputting the Neo4j logs to a place outside the container ensures we can troubleshoot any errors in Neo4j, even if the container crashes.
  - The third line with the -v option binds the import directory, so we can copy CSV or other flat files into that directory for importing into Neo4j. Load scripts for importing that data can also be placed in this folder for us to execute.
  - The next -v option line sets up our plugins directory. If we want to include any custom extensions or add the Neo4j APOC or graph algorithms library, exposing this directory simplifies the process of copying the jars for Neo4j to access.
* With the `--env` parameter, we initiate our Neo4j instance with a username and password. Neo4j automatically sets up basic authentication with the `neo4j` username as a foundation for security. Since it will initiate authentication and require a password change when first connecting, we can handle all of that in this parameter.
* Finally, the last line of the command above references the Docker image we want to pull from DockerHub (`neo4j`), as well as any specified version (in this case, just the `3.5.9-enterprise` edition) and the command will be executed when the container running: */bin/bash -c "/var/lib/neo4j/bin/neo4j-admin restore \
  --from=/backups/ --database=$NAME --force; \
  neo4j console* - this command will perform data recovery.
