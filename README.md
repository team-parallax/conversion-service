# team-parallax/conversion-service

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This project provides a webservice with a REST-API for file-conversions using `ffmpeg`, `imageMagick` and `unoconv`.

[[_TOC_]]

## Prerequisites

1. FFmpeg needs to be installed on your local machine if you are not running the webservice in a docker. In order to get everything working read these documents as it requires a little more attention to configure everything properly:
    - [ffmpeg](docs/ffmpeg) docs
    - [imageMagick](docs/imageMagick) docs
    - [unoconv](docs/unoconv) docs

2. Docker installation (required to build and run docker containers)

### Usage

You can either build this project from source or use a built docker image.

#### Building from source

If the above mentioned [requirements](#prerequisites) are met one can run the service using the command:

```console
yarn run start
```

##### Build docker image

One can also build the webservice in a `docker` container by using the following command:

```console
# building the container image
yarn run build:docker

# running the container
yarn run start:docker
```

#### Using pre-built docker image

You can use the built image of `teamparallax/conversion-webservice` by running the following command:

```console
# Pull image from Dockerhub
docker pull teamparallax/conversion-webservice:<TAG>

# Run the image
docker run [--name <NAME>] -p <YOUR_PORT>:3000 teamparallax/conversion-webservice:<TAG>
```

### Swagger API

To see the API-documentation in development-environment one can go to `http://localhost:3000/docs`.
