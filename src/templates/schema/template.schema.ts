import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IArgumentTemplate } from '../../interfaces/template.interface';

export type GeneralTemplateDocument = GeneralTemplate & Document;

@Schema({
  autoCreate: true,
  collection: 'template-node',
  strict: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class GeneralTemplate {
  @Prop({
    required: [true, 'NAME_IS_REQUIRED'],
    minlength: 5,
  })
  name: string;

  @Prop({
    required: [true, 'UID_IS_REQUIRED'],
    minlength: 5,
  })
  uid: string;

  @Prop({
    required: [true, 'PATH_IS_REQUIRED'],
    minlength: 4,
  })
  path: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TemplateNode',
    required: false,
  })
  document: IArgumentTemplate;

  @Prop({
    required: [true, 'GLOBAL_VARIABLES_IS_REQUIRED'],
  })
  globalVariables: Array<string>;
}

export const GeneralTemplateSchema =
  SchemaFactory.createForClass(GeneralTemplate);
