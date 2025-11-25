import { body } from 'express-validator';
import { getUser } from './models/users';

const todoV = [
    body('title').isString().trim().notEmpty()
        .withMessage('Заголовок не указан'),
    body('desc').isString().trim()
];
export { todoV };

const registerV = [
    body('username').isString().trim().notEmpty().withMessage('Не указано имя пользователя').custom((value) => {
        if (getUser(value))
            throw new Error('Пользователь с таким именем уже' + 'зарегестрирован...');
        return true;
        }),
    body('password').isString().trim().notEmpty().withMessage('Не указан пароль'),
    body('password2').isString().trim().notEmpty().withMessage('Не указан повтор пароля').custom((value, {req} ) => {
        if (req.body.password !== value)
            throw new Error('Выведения не совпадают...')
        return true;
    })
]

export { registerV };