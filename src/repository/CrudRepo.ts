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
    public static async fetchAll(table:string, row:any, value:any) {
        return await db.select('*').from(table).where(row, value)
    }
    
    /**
     * Fetch an item by uuid from a table
     */
    public static async fetchOneBy(table:string, row:any, value:any){
        return await db(table).where(row, value).first()
    }

    public static async updateById(table:string, row:any, value:any, data:any){
        return await db(table).where(row, value).update(data)
    }

    public static async deleteById(table:string, row:any, value:any) {
        return await db(table).where(row, value).delete()
    }
}
