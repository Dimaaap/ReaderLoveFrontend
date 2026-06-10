import { regexPatterns } from './regex-patterns'

export const validators = {
    usernameValidator: {
        required: "Ім'я обов'язкове"
    },
    emailValidator: {
        required: "Email обов'язковий",
        pattern: {
            value: regexPatterns.EMAIL_VALIDATION,
            message: "Некоректний формат email"
        }
    },
    passwordValidator: {
        required: "Пароль обов'язковий",
        minLength: { value: 6, message: "Мінімум 6 символів" }
    },
    passwordAgainValidator: (passwordValue) => ({
        required: "Повторіть пароль",
        validate: value => value === passwordValue || "Паролі не збігаються"
    })    
}