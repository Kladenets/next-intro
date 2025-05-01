import { Button } from '@/components/ui/button';
import { TodoState } from './task.types';

export interface AddTaskButtonProps extends React.ComponentProps<typeof Button> {
    label: string;
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
        | null
        | undefined;
    state?: TodoState;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function AddTaskButton({ label, variant, onClick, ...props }: AddTaskButtonProps) {
    return (
        <Button {...props} variant={variant} onClick={onClick}>
            {label}
        </Button>
    );
}

export { AddTaskButton };
