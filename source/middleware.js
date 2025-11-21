import { matchedData, validationResult } from "express-validator";  

export function requestToContext(req, res, next) {
    res.locals.req = req;
    next();
}

export function handleErrors(req, res, next) {
    const r = validationResult(req);
    if(!r.isEmpty()) {
        return res.redirect('back');
    }
    else {
        req.body = matchedData(req);
        next();
    }
}

