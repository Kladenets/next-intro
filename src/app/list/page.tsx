'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IndexedDb } from 'minimongo';
import { Suspense, useEffect, useReducer, useRef, useState } from 'react';
import { getTodos, initDB, TodosRecord, upsertTodo } from '../../../lib/minimongo';
import { TodoActionType } from './task.types';
import TaskList from './taskList';
import { TasksContext, TasksDispatchContext } from './tasksContext';
import { taskReducer } from './taskState';

export default function Page() {
    const [state, dispatch] = useReducer(taskReducer, {
        todos: [],
        needReload: false,
        dbConnected: false,
    });
    const [taskToAdd, setTodoToAdd] = useState('');
    const [search, setSearch] = useState('');
    const dbConnection = useRef({});

    // initial page load
    useEffect(() => {
        dbConnection.current = initDB(() => dispatch({ type: TodoActionType.dbConnected }));
        dispatch({ type: TodoActionType.requestReload });
    }, []);

    useEffect(() => {
        // console.log("needReload", state.needReload);
        // console.log("dbConnected", state.dbConnected);
        // console.log("dbConnection", dbConnection.current);
        // console.log("trying to reload");

        if (!state.needReload || !state.dbConnected || !dbConnection.current) {
            // console.log("couldn't reload");
            return;
        }

        try {
            getTodos(dbConnection.current as IndexedDb).fetch(
                (result: TodosRecord[]) => {
                    dispatch({ type: TodoActionType.reload, reloaded: result });
                    // console.log("did reload");
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (error: any) => console.error(error),
            );
        } catch (error) {
            // this should be a toast or some other user friendly error message
            console.error(error);
        }
    }, [state.needReload, state.dbConnected]);

    const newTodoOnClick = async () => {
        const response = await upsertTodo(dbConnection.current as IndexedDb, {
            task: taskToAdd,
            done: false,
        });

        if (response.error || !response.todo) {
            // need to display this to the user instead of console.error
            // console.error(response.error);
            return;
        }

        // this sets the input field to an empty string if the save succeeded
        setTodoToAdd('');
        dispatch({ type: TodoActionType.add, payload: response.todo });
    };

    return (
        <Suspense>
            <TasksContext.Provider value={state.todos}>
                <TasksDispatchContext.Provider value={dispatch}>
                    <div className="w-full h-screen">
                        {/* <div id="header" className="mr-5 ml-5 mt-5">
        </div> */}
                        {/* splitting these into separate components should improve performance and minimized rerenders */}
                        <div
                            id="header"
                            className="container mx-auto sticky flex items-center space-x-5 justify-self-center pr-5 pl-5 pt-5"
                        >
                            {/* <h1 className="text-2xl text-nowrap">I need to...</h1> */}
                            <Input
                                placeholder={'Search'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant={'outline'} onClick={newTodoOnClick}>
                                {'Search'}
                            </Button>
                        </div>
                        {/* <div id="list" className="grid items-center justify-center gap-2"> */}
                        <div
                            className="
                              flex items-center space-x-5 justify-self-center 
                              lg:static pr-5 pl-5 pt-5 lg:container lg:mx-auto w-full
                              fixed bottom-5 left-5 right-5 z-50 "
                        >
                            <Input
                                placeholder={'I need to...'}
                                value={taskToAdd}
                                onChange={(e) => setTodoToAdd(e.target.value)}
                            />
                            <Button variant={'outline'} onClick={newTodoOnClick}>
                                {'Add task'}
                            </Button>
                        </div>
                        {/* state is changing on every update, rerendering all todos - a context provider might all for better control of rerenders */}
                        <TaskList
                            className="
                              mt-10 ml-10 mr-10 width-full justify-center justify-self-center 
                              gap-5 lg:gap-10  md:columns-2 lg:columns-3 xl:columns-4"
                            db={dbConnection.current as IndexedDb}
                        />
                    </div>
                </TasksDispatchContext.Provider>
            </TasksContext.Provider>
        </Suspense>
    );
}
