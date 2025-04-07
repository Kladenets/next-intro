"use client"

import { ActionDispatch } from "react";
import { TodosRecord } from "../../../lib/minimongo";
import { upsertTodo } from "../../../lib/minimongo";
import { Checkbox } from "../../components/ui/checkbox";
import { TodoAction, TodoActionType, TodoState } from "./page";
import { IndexedDb } from "minimongo";

export interface TaskListProps extends React.ComponentProps<"div"> {
    data?: TodosRecord[];
    state?: TodoState;
    db?: IndexedDb;
    dispatch?: ActionDispatch<[action: TodoAction]>;
}

const handleClick = async (todo: TodosRecord, db?: IndexedDb, dispatch?: ActionDispatch<[action: TodoAction]>) => {
    if (!db) {
        console.error("db not connected, could not upsert todo");
        return;
    }
    
    const response = await upsertTodo(db, {...todo, done: !Boolean(todo.done)});

    if (response.error || !response.todo) {
        console.error(response.error);
        return;
    }

    if (!dispatch) {
        return;
    }

    dispatch({ type: TodoActionType.update, payload: response.todo });
}

// setting checked on the checkbox refering to the done status of the todo item works but it also means I can't click the checkbox
// not 100% sure why 
export default function TaskList({state, db, dispatch, ...props}: TaskListProps) {
    return <div id="list" {...props}>
        {state?.todos.map((todo: TodosRecord) => (<Checkbox key={todo._id} label={todo.task} checked={todo.done} onClick={async () => handleClick(todo, db, dispatch)}/> ))}
      </div>
}

