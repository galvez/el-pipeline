# el-pipeline

[![npm version](https://img.shields.io/npm/v/el-pipeline)](https://npmjs.com/package/el-pipeline)

A simple event loop pipelining function inspired by [ioredis-auto-pipeline](https://github.com/mcollina/ioredis-auto-pipeline/tree/master).

```js
import { elPipeline } from 'el-pipeline'
import Fastify from 'fastify'

function getServer() {
  const server = Fastify({
    logger: false
  })
  server.post('/queue', (req, reply) => {
    for (const item of req.body) {
      elPipeline(console.log, item)
    }
    reply.send('OK')
  })
  return server
}
```

## Install

```sh
npm i el-pipeline
```

## License

MIT
