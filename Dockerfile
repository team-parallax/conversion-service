FROM teamparallax/conversion-service-base-image:v0.2.0

# Build/Environment arguments
ARG host=localhost:3000
ENV HOST=$host

WORKDIR /app

ADD . ${WORKDIR}

# Install webservice dependencies and create OpenApi-Specification
RUN yarn install \
	&& yarn tsoa:create:host

CMD [ "yarn", "start" ]