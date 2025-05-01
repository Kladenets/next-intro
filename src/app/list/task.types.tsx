import { TodosRecord } from '../../../lib/minimongo';

export enum TodoActionType {
    dbConnected = 'dbConnected',
    requestReload = 'request_reload',
    reload = 'reload',
    add = 'add',
    update = 'update',
    delete = 'delete',
}

export interface TodoAction {
    type: TodoActionType;
    reloaded?: TodosRecord[];
    payload?: TodosRecord;
}

export interface TodoState {
    needReload: boolean;
    dbConnected?: boolean;
    todos: TodosRecord[];
}
