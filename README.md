# Base de données publique officielle des médicaments de l'Agence nationale de sécurité du médicament et des produits de santé

[![CircleCI](https://circleci.com/gh/sgmap/api-medicaments/tree/master.svg?style=svg)](https://circleci.com/gh/sgmap/api-medicaments/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/sgmap/api-medicaments/badge.svg?branch=ci)](https://coveralls.io/github/sgmap/api-medicaments?branch=master)

Expose the data behind [base-donnees-publique.medicaments.gouv.fr] with an API.

## Prerequisites

### Local

* [Node.js](http://nodejs.org)
* [Couchbase](www.couchbase.com)

### Production

* [Docker](https://www.docker.com/)

## Commands

### Local

Download datasets

```bash
./bin/download.sh
```

Import the files into the database

```bash
./bin/import
```

Run the server (API)

```bash
./bin/www
```

### Deploy

```bash
./bin/deploy.sh
```

[base-donnees-publique.medicaments.gouv.fr]: http://base-donnees-publique.medicaments.gouv.fr/
