import { IAuthSignUpInput } from '@market-connector/types';
import { CreateUserDto } from '../../../modules/users';

export class SignUpDto extends CreateUserDto implements IAuthSignUpInput { }
