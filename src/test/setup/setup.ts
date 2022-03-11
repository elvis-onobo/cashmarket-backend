import {execSync} from 'child_process'

export = async () => {
 try {
    process.env.NODE_ENV = 'test'
    execSync('yarn knex migrate:latest')
    execSync('yarn knex seed:run')
 } catch (err) {
  // Log the error
  console.log('>>>>>> error setting up db >>> ', err)
 }
}
