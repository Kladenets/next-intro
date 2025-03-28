import { Button } from "@/components/ui/button";
import { TodoState } from "./page";

export interface AddTaskButtonProps extends React.ComponentProps<typeof Button> {
    label: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    state?: TodoState;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function AddTaskButton({
    label,
    variant,
    onClick,
    ...props
}: AddTaskButtonProps) {

    return <div>
        <Button {...props} variant={variant} onClick={onClick}>{label}</Button> 
    </div>
}

export { AddTaskButton };
