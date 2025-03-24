import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionDispatch, Dispatch, SetStateAction, useState } from "react";
import { addTodo } from "../../../lib/connect";
import { TodoAction, TodoActionType, TodoState } from "./page";

export interface AddTaskButtonProps extends React.ComponentProps<typeof Button> {
    label: string;
    state?: TodoState;
    dispatch?: ActionDispatch<[action: TodoAction]>;
}

const handleClick = async (newTask: string, setTodoToAdd: Dispatch<SetStateAction<string>>, todoActionDispatch?: ActionDispatch<[action: TodoAction]>) => {
    const response = await addTodo(newTask);
    console.log(response);

    if (response.error || !response.todo) {
        console.error(response.error);
        return;
    }

    if (!todoActionDispatch) {
        return;
    }

    // this sets the input field to an empty string if the save succeeded
    setTodoToAdd("");
    todoActionDispatch({ type: TodoActionType.add, payload: response.todo });
}

function AddTaskButton({
    label,
    dispatch: todoActionDispatch,
    ...props
}: AddTaskButtonProps) {
    const [taskToAdd, setTodoToAdd] = useState("");

    return <div>
        <Input placeholder="Add a task" value={taskToAdd} onChange={(e) => setTodoToAdd(e.target.value)} />
        <Button {...props} variant={"outline"} onClick={() => {handleClick(taskToAdd, setTodoToAdd, todoActionDispatch)}}>{label}</Button> 
    </div>
}

export { AddTaskButton };
