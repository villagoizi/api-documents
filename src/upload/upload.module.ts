import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule],
  providers: [
    UploadService,
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
  exports: [UploadService],
})
export class UploadModule {}
