import { DB_URL } from 'config/config'
import knex from 'knex'

const Knex = knex({
  client: "postgresql",
  connection: DB_URL
})

Knex.raw('SELECT 1')
.then(() => console.log(`Database Connected !!`))
.catch(err => console.log(err.message, DB_URL))

export default Knex