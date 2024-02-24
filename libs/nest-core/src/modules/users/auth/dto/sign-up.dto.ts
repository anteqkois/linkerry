import { IAuthSignUpInput } from '@linkerry/shared';
import { CreateUserDto } from '../..';

export class SignUpDto extends CreateUserDto implements IAuthSignUpInput { }
