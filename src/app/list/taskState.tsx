import { TodoAction, TodoActionType, TodoState } from './task.types';

// reducer actions should be called with the updated payload after a successful call to the database
export function taskReducer(state: TodoState, action: TodoAction) {
    switch (action.type) {
        case TodoActionType.dbConnected:
            return {
                ...state,
                dbConnected: true,
            };

        case TodoActionType.requestReload:
            return {
                ...state,
                needReload: true,
            };

        case TodoActionType.reload:
            if (!action.reloaded) {
                return state;
            }

            return {
                ...state,
                todos: [...action.reloaded],
                needReload: false,
            };

        case TodoActionType.add:
            if (!action.payload) {
                return state;
            }

            return {
                ...state,
                todos: [...state.todos, action.payload],
            };

        case TodoActionType.update:
            if (!action.payload) {
                return state;
            }

            return {
                ...state,
                todos: state.todos.map((todo) => {
                    if (todo._id === action.payload?._id) {
                        return action.payload;
                    } else {
                        return todo;
                    }
                }),
            };

        case TodoActionType.delete:
            if (!action.payload) {
                return state;
            }

            return {
                ...state,
                todos: [...state.todos.filter((item) => item._id !== action.payload?._id)],
            };

        default:
            throw Error('Unknown action.');
    }
}
