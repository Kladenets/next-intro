"use client"

import { ActionDispatch } from "react";
import { updateTodoDone } from "../../../lib/connect";
import { TodosRecord } from "../../../pocketbase_0.26.2_darwin_arm64/pocketbase-types";
import { Checkbox } from "../../components/ui/checkbox";
import { TodoAction, TodoActionType, TodoState } from "./page";

export interface TaskListProps extends React.ComponentProps<"div"> {
    data?: TodosRecord[];
    state?: TodoState;
    dispatch?: ActionDispatch<[action: TodoAction]>;
}

const handleClick = async (todo: TodosRecord, dispatch?: ActionDispatch<[action: TodoAction]>) => {
    const response = await updateTodoDone(todo, !Boolean(todo.done));

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
export default function TaskList({state, dispatch, ...props}: TaskListProps) {
    return <div id="list" {...props}>
        {state?.todos.map((todo: TodosRecord) => (<Checkbox key={todo.id} label={todo.task} checked={todo.done} onClick={async () => handleClick(todo, dispatch)}/> ))}
      </div>
}

