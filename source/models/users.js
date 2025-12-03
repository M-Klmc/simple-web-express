import { User } from "./__loaddatabase.js";

export async function getUser(name) {
    return await User.findOne({ username: name});
}

export async function addUser(user) {
    const oUser = new User(user);
    await oUser.save();
}

export async function removeUser(userId) {
    const result = await User.deleteOne({_id: userId});
    return result.deleteCount > 0;
}