import {object, string, TypeOf} from 'zod';

const PASSWORD_MIN_LENGTH = 6;
const NAME_MIN_LENGTH = 2;

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: 'First name is required'
        }).min(NAME_MIN_LENGTH, `First name too short - should contain at least ${NAME_MIN_LENGTH} characters`),
        lastName: string({
            required_error: 'Last name is required'
        }).min(NAME_MIN_LENGTH, `Last name too short - should contain at least ${NAME_MIN_LENGTH} characters`),
        email: string({
            required_error: 'Email is required'
        }).email('Not a valid email'),
        password: string({
            required_error: 'Password is required'
        }).min(PASSWORD_MIN_LENGTH, `Password too short - should contain at least ${PASSWORD_MIN_LENGTH} characters`),
        confirmedPassword: string({
            required_error: 'Confirmed password is required'
        }),
        authProvider: string({
            required_error: 'authProvider is required'
        })
    }).refine((data) => data.password === data.confirmedPassword, {
        message: 'Passwords do not match',
        path: ['confirmedPassword']
    })
});

export type CreateUserData = Omit<TypeOf<typeof createUserSchema>, "body.confirmedPassword">;