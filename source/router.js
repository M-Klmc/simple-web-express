import  session  from 'express-session';
import _fileStore from 'session-file-store';
import { flash } from 'express-flash-message';

import { Router, urlencoded, static as staticMiddleware } from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';

import { mainPage, detailPage, addPage, add, setDone, remove, setOrder, addendumWrapper }
       from './controllers/todos.js';
import { requestToContext, handleErrors, extendFlashAPI, getErrors, loadCurrentUser, isGuest, isLoggedIn } from './middleware.js';
import { todoV, registerV, loginV } from './validators.js';
import { mainErrorHandler, error500Handler } from './error-handlers.js';
import { cookie } from 'express-validator';
import { register } from 'node:module';
import { register as registerHandler, registerPage,loginPage, login, logout  } from './controllers/users.js';

const FileStore = _fileStore(session);

const router = Router();
router.use('/storage/uploaded', staticMiddleware('/storage/uploaded'))
router.use(staticMiddleware('public'));

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

router.use(requestToContext);

router.use(cookieParser());

router.use(session({
       store: new FileStore({
              path: '/storage/sessions',
              reapAsync: true,
              reapSyncFallback: true,
              fallbackSessionFn: () => {
                     return {};
              },
              logFn: () => {}
       }),
       secret: 'abcdefgh',
       resave: false,
       saveUninitialized: false,
       cookie: {
              maxAge: 1000 * 60 * 60
       }
}));

router.use(flash({sessionKeyName: 'flash-message'}));
router.use(extendFlashAPI);
router.use(loadCurrentUser);

router.get('/register', isGuest, getErrors, registerPage);
router.post('/register', isGuest, registerV, handleErrors, registerHandler);
router.get('/login', isGuest, getErrors, loginPage);
router.post('/login', isGuest, loginV, handleErrors, login);

router.use(isLoggedIn);

router.post('/logout', logout);

router.get('/add', getErrors, addPage);
router.post('/add', addendumWrapper, todoV, add);
router.get('/:id', detailPage);
router.put('/:id', setDone);
router.delete('/:id', remove);
router.post('/setorder', setOrder);
router.get('/', mainPage);

router.use(mainErrorHandler, error500Handler);

export default router;
