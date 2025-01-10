import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

const huskyDir = join(process.cwd(), '.husky')
const commitMsgHook = join(huskyDir, 'commit-msg')

if (!existsSync(huskyDir) || !existsSync(commitMsgHook)) {
  console.log('Husky hooks not found. Installing...')
  execSync('pnpm husky install', { stdio: 'inherit' })
  execSync('chmod +x .husky/*', { stdio: 'inherit' })
  console.log('Husky hooks installed successfully!')
} else {
  console.log('Husky hooks already installed.')
}
