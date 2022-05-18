import db from '../database/db'

/**
 * Basic CRUD operations class
 */
export default class CrudRepo {
 /**
  * Insert data to database
  * @param table
  * @param data
  * @returns
  */
 public static async create(table: string, data: object) {
  return await db(table).insert(data)
 }

 /**
  * Fetch all data
  * @param table
  * @param row
  * @param value
  * @returns
  */
 public static async fetchAll(table: string, row: string, value: any) {
  return await db.select('*').from(table).where(row, value)
 }

 /**
  * Returns paginated data from table
  * @param table table to query
  * @param row row to query
  * @param value value to query row
  * @param page page number
  * @returns
  */
 public static async fetchAllandPaginate(
  table: string,
  row: string,
  value: any,
  perPage: number = 20,
  page: number = 1,
  order: string = 'desc'
 ) {
  return await db(table)
   .where(row, value)
   .orderBy('created_at', order)
   .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
 }

 /**
  * Gets one row of matched data from the db
  * @param table the table to query
  * @param row the row to query
  * @param value the value to query by
  * @returns
  */
 public static async fetchOneBy(table: string, row: string, value: any) {
  return await db(table).where(row, value).first()
 }

 /**
  * Updates fields in db
  * @param table the table to query
  * @param row the row to query
  * @param value the value to query by
  * @param data the data to update
  * @returns
  */
 public static async update(table: string, row: string, value: any, data: any) {
  return await db(table).where(row, value).update(data)
 }

 /**
  * Deletes data
  * @param table the table to query
  * @param row the row to query
  * @param value the value to query by
  * @returns
  */
 public static async deleteById(table: string, row: string, value: any) {
  return await db(table).where(row, value).delete()
 }

 /**
  * Returns the sum of data for a field
  * @param table the table to query
  * @param row the row to query
  * @param pseudoName the name you want your sum result to bear e.g balance
  * @param conditions any conditions you want to filter by. Should be an object
  * @returns
  */
 public static async getSum(table: string, row: string, pseudoName: string, conditions: any) {
  return await db(table).where(conditions).sum(`${row} as ${pseudoName}`)
 }

 /**
  *
  * @param table table to search
  * @param row1 row to search
  * @param value1 value to search by
  * @param row2 other row to search
  * @param value2 other value to search by
  * @returns
  */
 public static async search(
  table: string,
  value: string,
  row1: string,
  row2: string,
  row3: string,
  row4: string,
  row5: string,
  page: number = 1,
  perPage: number = 20
 ) {
  return await db(table)
   .where(row1, 'like', `%${value}%`)
   .orWhere(row2, 'like', `%${value}%`)
   .orWhere(row3, 'like', `%${value}%`)
   .orWhere(row4, 'like', `%${value}%`)
   .orWhere(row5, 'like', `%${value}%`)
   .paginate({ perPage, currentPage: page, isLengthAware: true })
 }

 /**
  * Perform a search for just one field
  * @param table 
  * @param value 
  * @param row 
  * @returns 
  */
 public static async searchOne(table: string, value: string, row: string) {
  return await db(table).where(row, 'like', `%${value}%`).first()
 }

  /**
  * Fetch all data from a table
  * @param table
  * @returns
  */
   public static async fetchAllFromTable(table: string) {
    return await db.select('*').from(table)
   }
}
