import fs from 'fs'
import path from 'path'
import { SourceMapConsumer } from 'source-map'

const sourcesPath = path.resolve(
  __dirname,
  '../../../public/static/js/',
  process.env.AWS_EXECUTION_ENV ? 'prod' : 'dev',
)

// Load source maps only once into memory.
export const sourceMaps = fs.existsSync(sourcesPath)
  ? fs
      .readdirSync(sourcesPath)
      .filter(file => /\.map$/.test(file))
      .reduce(async (acc, fileName) => {
        const sourceMapFile = path.resolve(sourcesPath, fileName)
        const map = JSON.parse(fs.readFileSync(sourceMapFile) as any)

        acc[fileName] = await new SourceMapConsumer(map)

        return acc
      }, {})
  : {}

export default function mapErrorStack(stack: string) {
  if (typeof stack !== 'string' || !stack) {
    return stack
  }

  return stack
    .split('\n')
    .map(frame => {
      const frameMatch = frame.match(/\/static\/js\/prod\/(.+\.js):(\d+):(\d+)/)

      if (frameMatch) {
        const [, sourceFile, line, column] = frameMatch

        if (`${sourceFile}.map` in sourceMaps) {
          const sourceMap = sourceMaps[`${sourceFile}.map`]

          const original = sourceMap.originalPositionFor({
            line: +line,
            column: +column,
          })

          return `  at ${original.name} (${original.source}:${original.line}:${original.column})`
        }
      }

      return frame
    })
    .join('\n')
}
