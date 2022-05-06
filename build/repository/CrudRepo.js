"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
/**
 * Basic CRUD operations class
 */
class CrudRepo {
    /**
     * Insert data to database
     * @param table
     * @param data
     * @returns
     */
    static create(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)(table).insert(data);
        });
    }
    /**
     * Fetch all data
     * @param table
     * @param row
     * @param value
     * @returns
     */
    static fetchAll(table, row, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.select('*').from(table).where(row, value);
        });
    }
    /**
     * Returns paginated data from table
     * @param table table to query
     * @param row row to query
     * @param value value to query row
     * @param page page number
     * @returns
     */
    static fetchAllandPaginate(table, row, value, perPage = 20, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)(table).where(row, value).paginate({ perPage: perPage, currentPage: page });
        });
    }
    /**
     * Gets one row of matched data from the db
     * @param table the table to query
     * @param row the row to query
     * @param value the value to query by
     * @returns
     */
    static fetchOneBy(table, row, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)(table).where(row, value).first();
        });
    }
    /**
     * Updates fields in db
     * @param table the table to query
     * @param row the row to query
     * @param value the value to query by
     * @param data the data to update
     * @returns
     */
    static update(table, row, value, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)(table).where(row, value).update(data);
        });
    }
    /**
     * Deletes data
     * @param table the table to query
     * @param row the row to query
     * @param value the value to query by
     * @returns
     */
    static deleteById(table, row, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)(table).where(row, value).delete();
        });
    }
    /**
     * Returns the sum of data for a field
     * @param table the table to query
     * @param row the row to query
     * @param pseudoName the name you want your sum result to bear e.g balance
     * @param conditions any conditions you want to filter by. Should be an object
     * @returns
     */
    static getSum(table, row, pseudoName, conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)(table).where(conditions).sum(`${row} as ${pseudoName}`);
        });
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
    static search(table, value, row1, row2, row3, page = 1, perPage = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)(table)
                .where(row1, 'like', `%${value}%`)
                .orWhere(row2, 'like', `%${value}%`)
                .orWhere(row3, 'like', `%${value}%`)
                .paginate({ perPage, currentPage: page });
        });
    }
}
exports.default = CrudRepo;
