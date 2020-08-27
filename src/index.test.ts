import 'jest-extended'
import Fastify from 'fastify'
import fastifyNewrelic, { CustomNewRelic } from './index'

const mockSetTransaction = jest.fn(x => x);
const mockError = jest.fn(x => x);
const mockAttribute = jest.fn(x => x);

const mockNewrelic: CustomNewRelic = {
    setTransactionName(name: string): void {
        mockSetTransaction(name)
    },
    noticeError(error: Error, customAttributes?: { [key: string]: string | number | boolean }): void {
        mockError(error)
    },
    addCustomAttribute(key: string, value: string | number | boolean): void {
        mockAttribute(`attr: ${key}`)
    }
}

let testFastify: any

describe('Testing common functions', () => {
    test('Test configuration', async () => {
        await expect(Fastify({ logger: false })
                .register(fastifyNewrelic, { attributes: { 'test': () => 'test' }, newrelic: <any>null })
                .ready()).rejects.toThrow('The newrelic object must be set')
    })

    describe('Test base callbacks', () => {
        beforeAll(async () => {
            testFastify = Fastify({ logger: false })
                .register(fastifyNewrelic, { attributes: { 'test': () => 'test' }, newrelic: mockNewrelic })
                .get('/error', (req, rep) => { throw new Error('testError') })
                .get('/ok', (req, rep) => { rep.send('ok') })
            await testFastify.ready();
        });

        afterAll(async () => {
            await testFastify.close()
        });

        test('Test send error', async (done) => {
            await testFastify.inject({ method: 'GET', url: '/error', payload: {}, headers: {} })
            expect(mockError.mock.results[0].value.message).toEqual('testError')
            done()
        })
        test('Test set transaction name', async (done) => {
            await testFastify.inject({ method: 'GET', url: '/ok', payload: {}, headers: {} })
            expect(mockSetTransaction.mock.results[1].value).toEqual('GET/ok')
            done()
        })
        test('Test set attributes', async (done) => {
            await testFastify.inject({ method: 'GET', url: '/ok', payload: {}, headers: {} })
            expect(mockAttribute.mock.results[2].value).toEqual('attr: test')
            done()
        })
    })
})