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
    public static async create(table:string, data:object){
        return await db(table).insert(data)
    }

    /**
     * Fetch all data
     * @param table 
     * @param row 
     * @param value 
     * @returns 
     */
    public static async fetchAll(table:string, row:string, value:any) {
        return await db.select('*').from(table).where(row, value)
    }
    
    /**
     * Gets one row of matched data from the db
     * @param table the table to query
     * @param row the row to query
     * @param value the value to query by
     * @returns 
     */
    public static async fetchOneBy(table:string, row:string, value:any){
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
    public static async update(table:string, row:string, value:any, data:any){
        return await db(table).where(row, value).update(data)
    }

    /**
     * Deletes data
     * @param table the table to query
     * @param row the row to query
     * @param value the value to query by
     * @returns 
     */
    public static async deleteById(table:string, row:string, value:any) {
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
    public static async getSum(table:string, row:string, pseudoName:string, conditions:any){
        return await db(table).where(conditions).sum(`${row} as ${pseudoName}`)
    }
}
