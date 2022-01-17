import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemplatesModule } from './templates/templates.module';
import { NodesModule } from './nodes/nodes.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        authSource: 'admin',
        auth: {
          username: configService.get<string>('MONGODB_USER'),
          password: configService.get<string>('MONGODB_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    UploadModule,
    TemplatesModule,
    NodesModule,
  ],
})
export class AppModule {}
