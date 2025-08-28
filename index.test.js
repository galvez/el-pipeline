import Fastify from 'fastify'
import test from 'node:test'
import { setTimeout as pause } from 'node:timers/promises'
import { equal } from 'node:assert'
import { elPipeline } from './index.js'

const [loggedItems, itemLogger] = createItemLogger()

test('should not miss data', async () => {
  const server = getServer()
  const requests = []
  let itemCounter = 0
  for (let times = 0; times < 2; times++) {
    if (times === 1) {
      await pause(2000)
    }
    for (let i = 0; i < 100; i++) {
      const batch = []
      for (let k = 0; k < 100; k++) {
        batch.push(itemCounter++)
      }
      requests.push(
        server.inject({
          method: 'POST',
          url: '/queue',
          payload: batch,
        }),
      )
    }
  }
  await Promise.all(requests)
  setTimeout(() => {
    equal(loggedItems.length, itemCounter)
  }, 0)
})

function getServer() {
  const server = Fastify({
    logger: false
  })
  server.post('/queue', (req, reply) => {
    for (const item of req.body) {
      elPipeline(itemLogger, item)
    }
    reply.send('OK')
  })
  return server
}

function createItemLogger() {
  const loggedItems = []
  return [
    loggedItems,
    (item) => {
      loggedItems.push(item)
    },
  ]
}
