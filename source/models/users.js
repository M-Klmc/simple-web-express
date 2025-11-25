import { database, getObjectId, saveDatabase } from "./__loaddatabase";

const users = database.users;

export function getUser(name) {
    return users.find((el) => el.username === name);
}

export function addUser(user) {
    user._id = getObjectId();
    user.push(user);
    saveDatabase();
}