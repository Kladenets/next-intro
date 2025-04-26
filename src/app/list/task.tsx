import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TodosRecord } from "../../../lib/minimongo";
import { Trash2 } from "lucide-react";

export interface TaskProps extends React.ComponentProps<"div"> {
    todo?: TodosRecord;
    onClickCheckbox?: React.MouseEventHandler<HTMLButtonElement>;
    onClickDelete?: React.MouseEventHandler<HTMLButtonElement>; 
    deleteButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

export default function Task({todo, onClickCheckbox, onClickDelete, deleteButtonVariant}: TaskProps) {
    return <div className="flex items-center justify-between space-x-5 m-3 p-3 border-2 rounded-md  break-inside-avoid-column">
        <Checkbox key={todo?._id} label={todo?.task} checked={todo?.done} onClick={onClickCheckbox}/>
        <Button variant={deleteButtonVariant} size="icon" onClick={onClickDelete}><Trash2 /></Button>
    </div>
}