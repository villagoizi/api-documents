import { Injectable } from '@nestjs/common';
import { CreateFillDto } from '../../dto/add-fill-node.dto';
import { FieldGroupSchema } from '../../../interfaces/fill-node.type';

@Injectable()
export class FillNodeService {
  process(info: CreateFillDto) {
    const { data } = info;
    return this.validateAndMapFields(data);
  }

  validateAndMapFields(data: CreateFillDto['data']) {
    if (!Array.isArray(data))
      throw new Error('Data must be a array of fill nodes');
    const values: Array<FieldGroupSchema> = [];
    data.forEach((v) => {
      v.fields.forEach((f) => {
        const protoObject = Object.assign({}, f);
        if (this._hasOwnProperty(v, 'uid') && !!f.uid) {
          values.push(v);
        }
      });
    });

    return { groups: values };
  }

  private _hasOwnProperty<X extends {}, Y extends PropertyKey>(
    obj: X,
    prop: Y,
  ): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
  }
}
