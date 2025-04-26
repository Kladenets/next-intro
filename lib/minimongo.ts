/* eslint-disable @typescript-eslint/no-explicit-any */
// Require minimongo
import { globalConfig } from "@/app/_global-config";
import { IndexedDb } from "minimongo";

export interface TodosRecord {
    _id: string;
    task?: string;
    done?: boolean;
}

// Create local db (in memory database with no backing)
const todosCollection = "todos";

// Create IndexedDb
export const initDB = (callback: () => void) => {
   const db = new IndexedDb({namespace: "mydb"}, function() {
        // Add a collection to the database/grab the existing one
        db.addCollection(todosCollection, function() {
            console.log("added collection todos");
            callback();
        }, function() { console.error("Could not create or fetch collection:", todosCollection); });
    }, function() { console.error("Could not create IndexedDb instance:", todosCollection); });

    return db;
}

export async function upsertTodo(db: IndexedDb, todoFields: Omit<TodosRecord, "_id">, id?: string): Promise<{todo: TodosRecord | undefined, error: any | undefined}> {
    try {
      const record = await db.collections[todosCollection].upsert({ _id: id, ...todoFields });
      return { todo: record, error: undefined };
    } catch (error: any) {
        if (globalConfig.verbose) {
            console.error("connect.ts - could not upsert todo:", error);
        }
        
        return { todo: undefined, error: error };
    }
}

export async function deleteTodo(db: IndexedDb, id?: string, success?: () => void, error?: (err: any) => void): Promise<{error: any | undefined}> {
    try {
      await db.collections[todosCollection].remove({ _id: id, success, error });
      return { error: undefined };
    } catch (error: any) {
        if (globalConfig.verbose) {
            console.error("connect.ts - could not upsert todo:", error);
        }
        
        return { error: error };
    }
}

export function getTodos(db: IndexedDb): any {
    try {
        const records = db.collections[todosCollection].find({})
        return records;
    } catch (error: any) {

        // might be better to have a custom logging function that takes a string or an error, and then logs if verbose is true?
        if (globalConfig.verbose) {
            console.error("connect.ts - could not get todos:", error);
        }

        return { todos: undefined, error: error };
    }
};