import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IGeneralTemplate } from '../../interfaces/template.interface';
import { ILinkedNode } from '../../interfaces/linked-node.type';
import { FillNode } from '../../interfaces/fill-node.type';

export type TemplateNodeDocument = TemplateNode & Document;

@Schema({
  autoCreate: true,
  collection: 'template-node',
  strict: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class TemplateNode {
  @Prop({
    required: [true, 'TYPE_IS_REQUIRED'],
    enum: {
      values: ['fill', 'linked'],
      message: 'INVALID_TYPE',
    },
  })
  type: string;

  // @Prop({
  //   type: String,
  // })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
  })
  template: IGeneralTemplate;

  @Prop({ default: { groups: [] }, type: mongoose.Schema.Types.Mixed })
  info: ILinkedNode | FillNode;
}

export const TemplateNodeSchema = SchemaFactory.createForClass(TemplateNode);
