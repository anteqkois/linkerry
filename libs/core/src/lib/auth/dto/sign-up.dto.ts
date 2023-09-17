import { IAuthSignUpInput } from '@market-connector/shared';
import { CreateUserDto } from '../../../modules/users';

export class SignUpDto extends CreateUserDto implements IAuthSignUpInput { }
