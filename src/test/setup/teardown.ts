import {execSync} from 'child_process'

export = async () => {
 try {
    process.env.NODE_ENV = 'test'
    execSync('yarn knex migrate:rollback --all')
    execSync('yarn knex migrate:rollback --all')
 } catch (err) {
  // Log the error
  console.log('>>>>>> error setting up db >>> ', err)
 }
}
