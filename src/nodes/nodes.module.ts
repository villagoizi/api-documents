import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { LinkedNodeService } from './providers/linked-node/linked-node.service';
import { FillNodeService } from './providers/fill-node/fill-node.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkedNode, LinkedNodeSchema } from './schema/linked.schema';
import {
  TemplateNode,
  TemplateNodeSchema,
} from './schema/template-nodes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LinkedNode.name, schema: LinkedNodeSchema },
      { name: TemplateNode.name, schema: TemplateNodeSchema },
    ]),
  ],
  providers: [NodesService, LinkedNodeService, FillNodeService],
})
export class NodesModule {}
