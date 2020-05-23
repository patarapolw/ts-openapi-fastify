import fastify from 'fastify'
import swagger from 'fastify-oas'

import { Item } from './schema/schema'

const port = 9000

const app = fastify({
  logger: true
})

if (process.env.NODE_ENV === 'development') {
  app.register(require('fastify-cors'))
}

app.register(swagger, {
  routePrefix: '/doc',
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [
      {
        url: `http://localhost:${port}/`,
        description: 'Local server'
      }
    ]
  },
  exposeRoute: true
})

app.addSchema({
  ...require('./schema/schema.json'),
  $id: '/schema.json'
})

app.get('/schema.json', async () => {
  return require('./schema/schema.json')
})

app.get('/item', {
  schema: {
    response: {
      200: {
        $ref: '/schema.json#/definitions/Item'
      }
    }
  }
}, async () => {
  const it: Item = {
    id: 1,
    createdAt: new Date().toISOString(),
    content: 'hello'
  }
  return it
})

app.put('/item', {
  schema: {
    body: {
      $ref: '/schema.json#/definitions/Item'
    }
  }
}, async (_, reply) => {
  reply.status(200).send()
})

app.listen(port, (err) => {
  if (err) {
    console.error(err)
  }
  app.oas()
})
