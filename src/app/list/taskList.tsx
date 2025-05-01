'use client';

import { IndexedDb } from 'minimongo';
import { ActionDispatch, useContext } from 'react';
import { deleteTodo, TodosRecord, upsertTodo } from '../../../lib/minimongo';
import Task from './task';
import { TodoAction, TodoActionType } from './task.types';
import { TasksContext, TasksDispatchContext } from './tasksContext';

export interface TaskListProps extends React.ComponentProps<'div'> {
    db?: IndexedDb;
}

const handleClickCheckbox = async (
    todo: TodosRecord,
    db?: IndexedDb,
    dispatch?: ActionDispatch<[action: TodoAction]>,
) => {
    if (!db) {
        console.error('db not connected, could not upsert todo');
        return;
    }

    const response = await upsertTodo(db, { ...todo, done: !Boolean(todo.done) });

    if (response.error || !response.todo) {
        console.error(response.error);
        return;
    }

    if (!dispatch) {
        return;
    }

    dispatch({ type: TodoActionType.update, payload: response.todo });
};

const handleClickDelete = async (
    todo: TodosRecord,
    db?: IndexedDb,
    dispatch?: ActionDispatch<[action: TodoAction]>,
) => {
    if (!db) {
        console.error('db not connected, could not upsert todo');
        return;
    }

    const response = await deleteTodo(db, todo._id);

    if (response.error) {
        console.error(response.error);
        return;
    }

    if (!dispatch) {
        return;
    }

    dispatch({ type: TodoActionType.delete, payload: todo });
};

export default function TaskList({ db, ...props }: TaskListProps) {
    const todos = useContext(TasksContext) ?? [];
    const dispatch = useContext(TasksDispatchContext) ?? null;

    if (!todos || !dispatch) {
        return null;
    }

    return (
        <div id="list" {...props}>
            {todos?.map((todo: TodosRecord) => (
                <Task
                    todo={todo}
                    deleteButtonVariant="destructive"
                    key={todo._id}
                    onClickCheckbox={async () => handleClickCheckbox(todo, db, dispatch)}
                    onClickDelete={async () => handleClickDelete(todo, db, dispatch)}
                />
            ))}
        </div>
    );
}
