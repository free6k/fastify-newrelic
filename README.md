# `fastify-newrelic` DEPRECATED

> The plugin doesn't correctly work. All works except send error notice. Problems has in fastify, because it doens't send stack trace. If are you know how resole it? Open issue or pull request :)

## Installation

```shell
$ yarn add fastify-newrelic@beta
# or
$ npm i fastify-newrelic@beta
```

## Usage

Register the plugin with your Fastify server

```ts
import * as newrelic from 'newrelic'
import Fastify from 'fastify'
import fastifyNewrelic from 'fastify-newrelic'

const server = Fastify()

server.register(fastifyCron, {
    attributes: {
        'user-id': (req) => req.headers['x-userd-id']
    },
    newrelic
})
```
And need setup newrelic with environment variables or file ([see docs](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration))
```
NEW_RELIC_APP_NAME=
NEW_RELIC_LICENSE_KEY=
NEW_RELIC_NO_CONFIG_FILE=true # if you do not use newrelic.js
```
