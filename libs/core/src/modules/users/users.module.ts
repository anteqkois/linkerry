import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashService } from '../../lib/auth/hash.service';
import { MongodbModule } from '../../lib/mongodb';
import { userModelFactory } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeatureAsync([userModelFactory
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, HashService]
})
export class UsersModule { }
