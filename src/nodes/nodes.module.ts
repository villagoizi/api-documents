import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { LinkedNodeService } from './providers/linked-node/linked-node.service';
import { FillNodeService } from './providers/fill-node/fill-node.service';

@Module({
  providers: [NodesService, LinkedNodeService, FillNodeService],
})
export class NodesModule {}
