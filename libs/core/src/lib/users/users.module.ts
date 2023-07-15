import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashService } from '../auth/hash.service';
import { MongodbModule } from '../mongodb';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongodbModule,
    MongooseModule.forFeatureAsync([{
      name: User.name,
      useFactory: () => {
        const schema = UserSchema;
        schema.plugin(require('mongoose-unique-validator'), { message: 'Email or nick exists' }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
        return schema;
      },
    },
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, HashService]
})
export class UsersModule { }
