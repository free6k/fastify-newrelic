# `fastify-newrelic`
## Installation

```shell
$ yarn add fastify-newrelic
# or
$ npm i fastify-newrelic
```

## Usage

Register the plugin with your Fastify server

```ts
import Fastify from 'fastify'
import fastifyNewrelic from 'fastify-newrelic'

const server = Fastify()

server.register(fastifyCron, {
    attributes: {
        'user-id': (req) => req.headers['x-userd-id']
    }
})
```
And need setup newrelic with environment variables or file ([see docs](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration))
```
NEW_RELIC_APP_NAME=
NEW_RELIC_LICENSE_KEY=
NEW_RELIC_NO_CONFIG_FILE=true # if you do not use newrelic.js
```