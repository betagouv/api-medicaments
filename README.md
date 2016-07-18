# Api Médicaments

Expose the data behind [base-donnees-publique.medicaments.gouv.fr] with an API.

## Prerequisites

### Local

* [Node.js](http://nodejs.org)
* [Couchbase](www.couchbase.com)

### Production

* [Docker](https://www.docker.com/)

## Commands

### Local

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
