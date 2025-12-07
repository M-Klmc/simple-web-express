import { matchedData, validationResult } from "express-validator";  
import { User } from "./models/__loaddatabase.js";

export function requestToContext(req, res, next) {
    res.locals.req = req;
    next();
}

export async function handleErrors(req, res, next) {
    const r = validationResult(req);
    if(!r.isEmpty() || req.errObj) {
        const t = {
            ...r.mapped(),
            ...req.errObj
        };
        await req.flash('errors', t);
        await req.flash('body', req.body);
        res.redirect('back');
    } else {
        req.body = matchedData(req);
        next();
    }
}

export function extendFlashAPI(req, res, next) {
    req.getFlash = async function(name) {
        const d = await this.consumeFlash(name);
        return d.length > 0 ? d[0] : undefined;
    }
    next();
}

export async function getErrors(req, res, next) {
    res.locals.errors = await req.getFlash('errors') || {};
    res.locals.body = await req.getFlash('body') || {};
    next();
}

export async function loadCurrentUser(req, res, next) {
    try {
        if (req.session.user) {
            let username;
            
            if (typeof req.session.user === 'string') {
                username = req.session.user;
            } else if (req.session.user && req.session.user.username) {
                username = req.session.user.username;
            } else if (req.session.user && req.session.user.id) {
                username = req.session.user.id;
            }
            
            if (username) {
                const user = await User.findOne({ username: username });
                if (user) {
                    req.user = {
                        id: user._id,
                        username: user.username
                    };
                } else {
                    req.user = null;
                }
            } else {
                req.user = null;
            }
        } else {
            req.user = null;
        }
    } catch (err) {
        console.error('Error in loadCurrentUser:', err);
        req.user = null;
    }
    
    res.locals.user = req.user;
    next();
}

export function isGuest(req, res, next) {
    if (req.user)
        res.redirect('/');
    else
        next();
}

export function isLoggedIn(req, res, next) {
    if(req.user)
        next();
    else
        res.redirect('/login');
}