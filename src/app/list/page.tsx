"use client"

import { Suspense, useEffect, useReducer, useState } from "react";
import { getTodos, TodosRecord, upsertTodo } from "../../../lib/minimongo";
import TaskList from "./taskList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

      return {
        todos: state.todos.map((todo) => {
          if (todo._id === action.payload?._id) {
            return action.payload;
          } else {
            return todo;
          }
        }),
        needReload: false
      };

    case TodoActionType.delete:
      if (!action.payload) {
        return state;
      } 

      return {
        todos: state.todos.filter((item) => item._id !== action.payload?._id),
        needReload: false
      };

    default:
      throw Error('Unknown action.');
  }
}

export default function Page() {
    const [state, dispatch] = useReducer(reducer, { todos: [], needReload: false });
    const [taskToAdd, setTodoToAdd] = useState("");
    const [search, setSearch] = useState("");

    // initial page load
    useEffect(() => {
      dispatch({ type: TodoActionType.requestReload });
    }, []);

    useEffect(() => {
      if (!state.needReload) {
        return;
      }

      getTodos().fetch(
          (result: TodosRecord[]) => {
            dispatch({ type: TodoActionType.reload, reloaded: result });
          }, 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error: any) => console.error(error)
        );

    }, [state.needReload]);

    const newTodoOnClick = async () => {
      const response = await upsertTodo({task: taskToAdd, done: false});
  
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
      <div className="w-full h-screen">
        {/* <div id="header" className="mr-5 ml-5 mt-5">
          
          <SearchInput placeholder="Search..." />
        </div> */}
        {/* splitting these into separate components should improve performance and minimized rerenders */}
        <div id="header" className="container mx-auto sticky flex items-center space-x-5 justify-self-center pr-5 pl-5 pt-5">
          {/* <h1 className="text-2xl text-nowrap">I need to...</h1> */}
          <Input placeholder={"Search"} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant={"outline"} onClick={newTodoOnClick}>{"Search"}</Button>
        </div>
        {/* <div id="list" className="grid items-center justify-center gap-2"> */}
        <div className="flex items-center space-x-5 justify-self-center 
            lg:static pr-5 pl-5 pt-5 lg:container lg:mx-auto w-full
            fixed bottom-5 left-5 right-5 z-50 ">
          <Input placeholder={"I need to..."} value={taskToAdd} onChange={(e) => setTodoToAdd(e.target.value)} />
          <Button variant={"outline"} onClick={newTodoOnClick}>{"Add task"}</Button>
        </div>
        {/* state is changing on every update, rerendering all todos - a context provider might all for better control of rerenders */}
        <TaskList className="mt-10 width-full justify-center justify-self-center 
          gap-5 lg:gap-10  md:columns-2 lg:columns-3 xl:columns-4" state={state} dispatch={dispatch} />
      </div>
    </Suspense>
  }