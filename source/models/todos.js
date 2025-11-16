// module of the planned tasks model

import { database, saveDataBase, getObjectId } from "./__loaddatabase.js";

const todos = database.todos;

export function getList() {
    return todos;
}

export function getItem(id) {
    return todos.find( (el) => el._id === id);
}

export function addItem(todo) {
    todo._id = getObjectId();
    todos.push(todo);
    saveDataBase();
}

function getItemIndex(id) {
    return todos.findIndex((el) => el._id === id);
}

export function setDoneItem(id) {
    const index = getItemIndex(id);
    if (index > -1) {
        todos[index].done = true;
        saveDataBase();
        return true;
    } else
        return false;
}

export function deleteItem(id) {
    const index = getItemIndex(id);
    if (index > -1) {
        todos.splice(index, 1);
        saveDataBase();
        return true;
    } else
        return false;
}