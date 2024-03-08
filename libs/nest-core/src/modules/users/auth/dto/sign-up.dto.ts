import { IAuthSignUpInput } from '@linkerry/shared';
import { CreateUserDto } from '../../dto/create-user.dto';

export class SignUpDto extends CreateUserDto implements IAuthSignUpInput { }
