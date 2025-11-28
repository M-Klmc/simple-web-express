import { body } from "express-validator";
import { getUser } from "./models/users";

const loginV = [
  body("username")
    .isString()
    .trim.notEmpty()
    .withMessage("Не указано имя пользователя")
    .custom(
      (value,
      ({ req } = {
        const: (user = getUser(value)),
        if(user) {
          this.req.__user = user;
        },
      }))
    ),
];
