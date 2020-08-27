import fp from 'fastify-plugin'
import { FastifyPlugin, FastifyRequest } from 'fastify'

export interface CustomAttributes {
    [key: string]: (request: FastifyRequest) => string
}

export interface CustomNewRelic {
    setTransactionName(name: string): void
    noticeError(error: Error, customAttributes?: { [key: string]: string | number | boolean }): void
    addCustomAttribute(key: string, value: string | number | boolean): void;
}

export interface Config {
    attributes?: CustomAttributes
    newrelic: CustomNewRelic
}

const plugin: FastifyPlugin<Config> = (fastify, opts, next) => {
    const nr: CustomNewRelic = opts.newrelic

    if (!nr) {
        throw new Error('The newrelic object must be set')
    }

    try {
        const getTransactionName = (request: FastifyRequest) => {
            return `${request.routerMethod}${request.routerPath || 'uknown'}`
        }

        fastify.addHook('onError', (request, reply, error, next) => {
            next()
            nr.noticeError(error)
        });

        fastify.addHook('onRequest', (request, reply, next) => {
            nr.setTransactionName(getTransactionName(request))

            if (opts.attributes) {
                for (const [key, value] of Object.entries(opts.attributes)) {
                    nr.addCustomAttribute(key, value(request))
                }
            }

            next()
        })

        fastify.decorate('newrelic', {
            getter() {
                return nr
            }
        })

        next()
    } catch (error) {
        next(error)
    }
}

export default fp(plugin, {
    name: 'fastify-newrelic',
    fastify: '3.x'
})