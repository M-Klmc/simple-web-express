

import createError from 'http-errors';

import { getList, getItem, addItem, setDoneItem, deleteItem, getMostActiveUsers } from '../models/todos.js';
import { body, validationResult } from 'express-validator';

import { addendumUploader } from '../uploaders.js';

import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { currentDir } from '../utility.js';

export async function mainPage(req, res) {
    let list = await getList(req.user.id);
    if(req.cookies.doneAtLast === '1') {
        list = [...list];
        list.sort((el1, el2) => {
            if (el1.done !== el2.done) {
                return el1.done ? 1: -1;
            }
            return new Date(el1.createdAt) - new Date(el2.createdAt);
        })
    }

    if (req.query.search) {
        const q = req.query.search.toLowerCase();
        list = list.filter((el) => {
            if (el.title.toLowerCase().includes(q))
                return true;
            else
                if (el.desc)
                    return el.desc.toLowerCase().includes(q);
                else
                    return false;
        });
    }

    res.render('main', {
        todos: list,
        title: 'Главная'
    });
}

export async function detailPage(req, res, next) {
    try {
        const t = await getItem(req.params.id, req.user.id);

    if (!t)
        throw createError(404, 'Запрошенное дело не существует');

    res.render('detail', {
        todo: t,
        title: t.title
    });
    } catch (err) {
        next(err);
    }
} 

export function addPage(req, res) {
    res.render('add', {
        title: 'Добавление дела',
        body: res.locals.body || {},
        errors: res.locals.errors || {}
    });
}

export async function add(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await req.flash('errors', errors.mapped());
        await req.flash('body', req.body);
        return res.redirect('/add')
    }
    const todo = {
        title: req.body.title,
        desc: req.body.desc || '',
        user: req.user.id
    };
    if (req.file)
        todo.addendum = req.file.filename;
    await addItem(todo);
    res.redirect('/');
}

export async function setDone(req, res, next) {
    try {
        if ( await setDoneItem(req.params.id, req.user.id))
            res.redirect('/');
    else
        throw createError(404, 'Запрошенное дело не существует');
    } catch (err) {
        next(err);
    }
}

export async function remove(req, res, next) {
    try {
        const t = await getItem(req.params.id, req.user.id);
        if(!t)
            throw createError(404, 'Запрошенное дело не существует');

        if(t.addendum) {
            try {
                await rm(join(currentDir, 'storage', 'uploaded', t.addendum));
            } catch (err) {
                if(err.code !== 'ENOENT') {
                throw err;
                }
            
            }
        }
        deleteItem(t._id, req.user.id);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
}


export function setOrder(req, res) {
    res.cookie('doneAtLast', req.body.done_at_last);
    res.redirect('/');
}

export function addendumWrapper(req, res, next) {
    addendumUploader(req, res, (err) => {
        if(err) {
            if(err.code == 'LIMIT_FILE_SIZE') {
                req.errorObj = {
                    addendum: {
                        msg: 'Допускаются лишь файлы размером' + 'не более 100 Кбайт'
                    } 
                };
                next();
            } else {
                next(err);
                
            }
        } else {
            next();
        }
    }) 

}

export async function  mostActiveUsersPage(req, res) {
    const r = await getMostActiveUsers();
    res.render('most-active', {
        title: 'Самые активные пользователи',
        mostActiveAll: r[0],
        mostActiveDone: r[1]
    });
}