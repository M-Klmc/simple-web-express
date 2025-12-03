import { randomBytes } from 'node:crypto';

import { pbkdf2Promisified } from '../utility.js';
import { addUser, removeUser } from '../models/users.js';
import { remove } from './todos.js';


export async function registerPage (req, res) {
    res.render('register', { title: 'Регистрация' });
}

export async function register(req, res) {
    const salt = randomBytes(16);
    const hash = await pbkdf2Promisified(req.body.password, salt, 100000, 32, 'sha256');
    const user = {
        username: req.body.username,
        password: hash,
        salt: salt
    };
    await addUser(user);
    res.redirect('/login');
}

export function loginPage(req, res) {
    res.render('login', { title: 'Вход' });
}

export function login(req, res, next) {
    req.session.regenerate((err) => {
        if (err)
            next(err);
        else {
            req.session.user = {
                id: req.__user.username
            };
            req.session.save((err) => {
                if (err)
                    next(err);
                else
                    res.redirect('/');
            });
        }
    });
}

export function logout (req, res, next) {
    delete req.session.user;
    req.session.save((err) => {
        if (err)
            next(err);
        else {
            req.session.regenerate((err) => {
                if (err)
                    next(err);
                else
                    res.redirect('/');
            })
        }
    })
}

export async function deleteUser(req, res, next) {
    try {
        const username = req.session.user?.id;
        if(!username) {
            return res.status(401).send('Пользователь не аутентифицирован');
        }
        const userRemoved = await removeUser(username);

        if(userRemoved) {
            delete req.session.user;
            req.session.save((err) => {
                if(err) {
                    next(err);
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.status(404).send('Пользователь не найден');
        }
    } catch (err) {
        next(err);
    }

}