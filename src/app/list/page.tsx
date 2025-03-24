"use client"

import { Suspense, useEffect, useReducer } from "react";
import { getTodos } from "../../../lib/connect";
import { TodosRecord } from "../../../pocketbase_0.26.2_darwin_arm64/pocketbase-types";
import { AddTaskButton } from "./addTaskButton";
import TaskList from "./taskList";

export enum TodoActionType {
  requestReload = 'request_reload',
  reload = 'reload',
  add = 'add',
  update = 'update',
  delete = 'delete',
} 

export interface TodoAction {
  type:TodoActionType,
  reloaded?: TodosRecord[],
  payload?: TodosRecord
}

export interface TodoState {
  needReload: boolean;
  todos: TodosRecord[];
}

// reducer actions should be called with the updated payload after a successful call to the database
function reducer(state: TodoState, action: TodoAction) {
  switch (action.type) {
    case TodoActionType.requestReload:
      return {
        ...state,
        needReload: true
      };

    case TodoActionType.reload:
      if (!action.reloaded) {
        return state;
      }

      return {
        todos: [...action.reloaded],
        needReload: false
      };

    case TodoActionType.add:
      if (!action.payload) {
        return state;
      }

      return {
        todos: [...state.todos, action.payload],
        needReload: false
      };

    case TodoActionType.update:
      if (!action.payload) {
        return state;
      }

      const tempTodos = state.todos;
      const index = tempTodos.findIndex((item) => item.id === action.payload?.id);
      tempTodos[index] = action.payload;

      return {
        todos: tempTodos,
        needReload: false
      };

    case TodoActionType.delete:
      if (!action.payload) {
        return state;
      } 

      return {
        todos: state.todos.filter((item) => item.id !== action.payload?.id),
        needReload: false
      };

    default:
      throw Error('Unknown action.');
  }
}

export default function Page() {
    const [state, dispatch] = useReducer(reducer, { todos: [], needReload: false });

    // initial page load
    useEffect(() => {
      dispatch({ type: TodoActionType.requestReload });
    }, []);

    useEffect(() => {
      if (!state.needReload) {
        return;
      }

      getTodos().then((todos) => {
        dispatch({ type: TodoActionType.reload, reloaded: todos });
      });

    }, [state.needReload]);

    return <Suspense>
      <div className="width-full h-screen flex flex-col items-center justify-center gap-4">
        <div id="header" className="grid items-center space-x-2 justify-center">
          <h1 className="text-2xl">Things to do</h1>
          <AddTaskButton dispatch={dispatch} label="Add task"/>
        </div>
        <TaskList state={state} dispatch={dispatch} />
      </div>
    </Suspense>
  }