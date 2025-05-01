import { ActionDispatch, createContext } from 'react';
import { TodosRecord } from '../../../lib/minimongo';
import { TodoAction } from './task.types';

export const TasksContext = createContext<TodosRecord[] | null>(null);
export const TasksDispatchContext = createContext<ActionDispatch<[action: TodoAction]> | null>(
    null,
);
