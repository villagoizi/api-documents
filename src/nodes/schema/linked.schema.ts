import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ILinkedNode } from '../../interfaces/linked-node.type';

export type LinkedNodeDocument = LinkedNode & Document;

const WayConditionsSchema = {
  code: Number,
  condition: Boolean,
};
const VariablesSchema = {
  title: String,
  key: String,
  isBoth: { type: Boolean, default: false },
  condition: { type: Boolean, default: null },
};
const ParagraphSchema = {
  key: String,
  value: String,
  condition: Boolean,
};
const DataSchema = {
  question: String,
  variables: [VariablesSchema],
  paragraph: [ParagraphSchema],
};

const Node = {
  next: WayConditionsSchema,
  code: { type: Number, required: true },
  validatePrevious: [{ ...WayConditionsSchema, next: Number }],
  finish: { ...WayConditionsSchema, default: null },
  data: DataSchema,
};

@Schema({
  autoCreate: true,
  collection: 'linked-node',
  strict: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class LinkedNode {
  @Prop(raw([Node]))
  groups: ILinkedNode;
}

export const LinkedNodeSchema = SchemaFactory.createForClass(LinkedNode);
