import { readFileSync } from "node:fs";
import { database, getObjectId, saveDatabase, dataFileName } from "./__loaddatabase.js";

const users = database.users;

export function getUser(name) {
    const dataFile = readFileSync(dataFileName, 'utf-8');
    const currentDatabase = JSON.parse(dataFile);
    return currentDatabase.users.find((el) => el.username === name);

}

export function addUser(user) {
    user._id = getObjectId();
    users.push(user);
    saveDatabase();
}