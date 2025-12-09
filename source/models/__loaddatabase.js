import { query } from "express-validator";
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
    versionKey: false,
    statics: {
        async findOneAndSetDone(id, user) {
            const todo = await this.findOne({ _id: id, user: user });
                if (todo)
                    await todo.markAsDone();
                return todo;
            },
            query: {
                contains(val) {
                    return this.or([
                        { title: new RegExp(val, 'i') },
                        { desc: new RegExp(val, 'i') }
                    ]);
                }
            }
        }
    });
scTodo.index({done: 1, createdAt: 1});
scTodo.method('markAsDone', async function () {
    this.done = true;
    await this.save();
});

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
        type: Buffer,
        required: true
    },
}, {
    versionKey: false, 
    });

let Todo, User;

export async function connectToDB() {
    await connect(dbURI, { dbName: dbName });
    Todo = model('Todo', scTodo);
    User = model('User', scUser)
}

export { Todo, User };