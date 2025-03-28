/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalConfig } from "@/app/_global-config";
import PocketBase from "pocketbase";
import { TodosRecord } from "../pocketbase_0.26.2_darwin_arm64/pocketbase-types";

// initialise client
export const pbClient = new PocketBase("http://127.0.0.1:8090");

// we are using typescript for this tutorial as it considered an industry standard
// this code add a todo item to the database
// if we want to get specific I can add a partial type for a new task based off of TodosRecord
export async function addTodo(newTask: string): Promise<{todo: TodosRecord | undefined, error: any | undefined}> {
    try {
        const record = await pbClient.collection("todos").create({task: newTask, done: false});
        return { todo: record, error: undefined };
    } catch (error: any) {
        if (globalConfig.verbose) {
            console.error("connect.ts - could not add todo:", error);
        }

        return { todo: undefined, error: error };
    }
}

// if I want to be able to update the task of an existing todo item I'll change this function, this was just a PoC
export async function updateTodoDone(todo: TodosRecord, done: boolean): Promise<{todo: TodosRecord | undefined, error: any | undefined}> {
    try {
      const record = await pbClient.collection("todos").update(todo.id, {done: done});
      return { todo: record, error: undefined };
    } catch (error: any) {
        if (globalConfig.verbose) {
            console.error("connect.ts - could not update todo:", error);
        }
        
        return { todo: undefined, error: error };
    }
}

// this fetchs all the todos from database
export async function getTodos(): Promise<{todos: TodosRecord[] | undefined, error: any | undefined}> {
    try {
        const records = await pbClient.collection('todos').getFullList(200 /* batch size */, {
            sort: 'created',
        });
        return { todos: records, error: undefined };
    } catch (error: any) {

        // might be better to have a custom logging function that takes a string or an error, and then logs if verbose is true?
        if (globalConfig.verbose) {
            console.error("connect.ts - could not get todos:", error);
        }

        return { todos: undefined, error: error };
    }
};