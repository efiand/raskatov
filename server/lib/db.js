import { DatabaseSync } from "node:sqlite";
import { initialData } from "../../tools/sql.js";

/** @type {DatabaseSync} */
export const database = new DatabaseSync(":memory:");

database.exec(initialData);
