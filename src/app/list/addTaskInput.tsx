import { Input } from "@/components/ui/input";

export interface AddTaskInputProps extends React.ComponentProps<typeof Input> {
    placeholder?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

// const handleClick = async (newTask: string, setTodoToAdd: Dispatch<SetStateAction<string>>, todoActionDispatch?: ActionDispatch<[action: TodoAction]>) => {
//     const response = await addTodo(newTask);
//     console.log(response);

//     if (response.error || !response.todo) {
//         // need to display this to the user instead of console.error
//         // console.error(response.error);
//         return;
//     }

//     if (!todoActionDispatch) {
//         return;
//     }

//     // this sets the input field to an empty string if the save succeeded
//     setTodoToAdd("");
//     todoActionDispatch({ type: TodoActionType.add, payload: response.todo });
// }

function AddTaskInput({
    placeholder,
    onChange,
    value,
    ...props
}: AddTaskInputProps) {
    // const [taskToAdd, setTodoToAdd] = useState("");

    return <div>
        <Input placeholder={placeholder} value={value} onChange={onChange} {...props} />
    </div>
}

export { AddTaskInput };
