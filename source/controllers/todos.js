

import createError from 'http-errors';

import { getList, getItem, addItem, setDoneItem, deleteItem } from '../models/todos.js';
import { body, validationResult } from 'express-validator';

import { addendumUploader } from '../uploaders.js';

import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { currentDir } from '../utility.js';

export function mainPage(req, res) {
    let list = getList(req.user.id);
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

export function detailPage(req, res) {
    const t = getItem(req.params.id, req.user.id);

    if (!t)
        throw createError(404, 'Запрошенное дело не существует');

    res.render('detail', {
        todo: t,
        title: t.title
    });
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
        user: req.user.id,
        createdAt: (new Date()).toString()
    };
    if (req.file)
        todo.addendum = req.file.filename;
    addItem(todo);
    res.redirect('/');
}

export function setDone(req, res) {
    if (setDoneItem(req.params.id, req.user.id))
        res.redirect('/');
    else
        throw createError(404, 'Запрошенное дело не существует');
}

export async function remove(req, res, next) {
    try {
        const t = getItem(req.params.id, req.user.id);
        if(!t)
            throw createError(404, 'Запрошенное дело не существует');
        if(t.addendum)
            await rm(join(currentDir, 'storage', 'uploaded', t.addendum));
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
