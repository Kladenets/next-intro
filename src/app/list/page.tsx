"use client"

import { Suspense, useEffect, useReducer, useState } from "react";
import { addTodo, getTodos } from "../../../lib/connect";
import { TodosRecord } from "../../../pocketbase_0.26.2_darwin_arm64/pocketbase-types";
import { AddTaskButton } from "./addTaskButton";
import { AddTaskInput } from "./addTaskInput";
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
    const [taskToAdd, setTodoToAdd] = useState("");

    // initial page load
    useEffect(() => {
      dispatch({ type: TodoActionType.requestReload });
    }, []);

    useEffect(() => {
      if (!state.needReload) {
        return;
      }

      getTodos().then((response) => {

        if (response.error || !response.todos) {
            // instead of console.error need to display this for the user
            console.error("A connection could not be established with the database:", response.error);
          
          return;
        }

        dispatch({ type: TodoActionType.reload, reloaded: response.todos });
      });

    }, [state.needReload]);

    const newTodoOnClick = async () => {
      const response = await addTodo(taskToAdd);
      console.log(response);
  
      if (response.error || !response.todo) {
          // need to display this to the user instead of console.error
          // console.error(response.error);
          return;
      }
  
      // this sets the input field to an empty string if the save succeeded
      setTodoToAdd("");
      dispatch({ type: TodoActionType.add, payload: response.todo });
  }

    return <Suspense>
      <div className="width-full h-screen grid items-center justify-center gap-4">
        <div id="header" className="flex items-center space-x-2 justify-center">
          <h1 className="text-2xl">Things to do</h1>
        </div>
        <div className="flex space-x-2">
          <AddTaskInput placeholder="Add a task" value={taskToAdd} onChange={(e) => setTodoToAdd(e.target.value)} />
          <AddTaskButton label="Add task" variant={"outline"} onClick={newTodoOnClick}/>
        </div>
        <TaskList state={state} dispatch={dispatch} />
      </div>
    </Suspense>
  }