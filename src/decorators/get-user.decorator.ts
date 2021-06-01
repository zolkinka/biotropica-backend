import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/users.model';

export const GetUser = createParamDecorator((req, _): User => req.user);
