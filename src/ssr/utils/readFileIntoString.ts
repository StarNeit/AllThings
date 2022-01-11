import fs from 'fs'
import path from 'path'

export default (...paths: string[]) =>
  fs.readFileSync(path.resolve(...paths), 'utf-8')
