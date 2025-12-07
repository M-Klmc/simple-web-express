import { connect, Schema, model } from "mongoose";

const dbURI = process.env.DBURI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DBNAME || 'todos';

const scTodo = new Schema({
    title: String,
    desc: String,
    addendum: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        index: true,
        default: () => new Date()
    }
}, {
    versionKey: false
});
scTodo.index({done: 1, createdAt: 1});

const scUser = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: Buffer,
        required: true
}, 
    salt: {
        type:Buffer,
        required: true
    }
}, {
    versionKey: false
});

let Todo, User;

export async function connectToDB() {
    await connect(dbURI, { dbName: dbName });
    Todo = model('Todo', scTodo);
    User = model('User', scUser)
}

export { Todo, User };