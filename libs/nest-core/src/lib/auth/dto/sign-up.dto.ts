import { IAuthSignUpInput } from '@linkerry/shared';
import { CreateUserDto } from '../../../modules/users';

export class SignUpDto extends CreateUserDto implements IAuthSignUpInput { }
