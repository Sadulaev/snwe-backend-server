import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordValidation', async: false })
export class PasswordValidation implements ValidatorConstraintInterface {
  validate(text: string) {
    const regEx =
      /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
    return regEx.test(text);
  }

  defaultMessage(): string {
    return 'Пароль должен быть от 6 символов и включать в себя заглавные и строчные латинские буквы,хотя бы одну цифру и спецсимвол(!@#$%^&*)';
  }
}
