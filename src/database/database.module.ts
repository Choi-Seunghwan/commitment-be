import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ENV_DATABASE_HOST,
  ENV_DATABASE_NAME,
  ENV_DATABASE_TYPE,
} from 'src/constants';
import { User } from 'src/user/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<DATABASE_TYPE_STR>(ENV_DATABASE_TYPE),
        host: configService.get<string>(ENV_DATABASE_HOST),
        database: configService.get<string>(ENV_DATABASE_NAME),
        entities: [User],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
