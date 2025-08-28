import pMap from 'p-map'
import { performance } from 'node:perf_hooks'

// A simple event-loop pipeline

const maxELU = 0.9
const queue = []
let scheduled = false

export function elPipeline(task, ...params) {
  queue.unshift([task, params])
  if (!scheduled) {
    setTimeout(elPipelineWorker, 0)
  }
}

function getConcurrency() {
  if (performance.eventLoopUtilization() > maxELU) {
    return 4
  }
  return 16
}

function fnMapper([fn, params]) {
  return fn(...params)
}

async function elPipelineWorker() {
  if (!queue.length) {
    return
  }
  const len = queue.length
  const tasks = queue.splice(0, len)
  if (tasks.length > 0) {
    const concurrency = getConcurrency()
    await pMap(tasks, fnMapper, { concurrency })
  }
  scheduled = false
}
