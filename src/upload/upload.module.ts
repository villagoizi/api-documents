import { Module, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { UploadController } from './upload.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    {
      provide: 'UPLOAD_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('UPLOAD_HOST'),
            port: +configService.get('UPLOAD_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class UploadModule {}
