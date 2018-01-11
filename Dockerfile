FROM mhart/alpine-node:8.9.1

LABEL name=api

WORKDIR /home/api
ADD . /home/api

RUN cd /home/api && yarn --pure-lockfile --silent

EXPOSE 3030

CMD ["yarn", "start:live"]

