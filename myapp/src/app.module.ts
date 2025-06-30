import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import envConfiguration from './config/env.configuration';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { DocumentsModule } from './documents/documents.module';
import { Document } from './documents/document.entity';
import { IngestionModule } from './ingestion/ingestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.ENVIRONMENT || 'dev'}`,
      load: [envConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('db.host'),
        port: config.get<number>('db.port'),
        username: config.get('db.user'),
        password: config.get('db.pass'),
        database: config.get('db.name'),
        entities: [User, Document],
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    DocumentsModule,
    IngestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
