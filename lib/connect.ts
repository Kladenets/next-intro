/* eslint-disable @typescript-eslint/no-explicit-any */
import PocketBase from "pocketbase";
import { TodosRecord } from "../pocketbase_0.26.2_darwin_arm64/pocketbase-types";
// initialise client
export const pbClient = new PocketBase("http://127.0.0.1:8090");

// we are using typescript for this tutorial as it considered an industry standard
// this code add a todo item to the database
// if we want to get specific I can add a partial type for a new task based off of TodosRecord
export async function addTodo(newTask: string): Promise<{todo: TodosRecord | undefined, error: string | undefined}> {
  try {
    const record = await pbClient.collection("todos").create({task: newTask, done: false});
    return { todo: record, error: undefined };
  } catch (error: any) {
    return { todo: undefined, error: error.message };
  }
}

export async function updateTodoDone(todo: TodosRecord, done: boolean): Promise<{todo: TodosRecord | undefined, error: string | undefined}> {
    try {
      const record = await pbClient.collection("todos").update(todo.id, {done: done});
    //   console.log(record);
      return { todo: record, error: undefined };
    } catch (error: any) {
      return { todo: undefined, error: error.message };
    }
}

// this fetchs all the todos from database
export async function getTodos(): Promise<TodosRecord[]> {
    const records =await pbClient.collection('todos').getFullList(200 /* batch size */, {
        sort: '-created',
    });
    
    return records;
};