import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Subtask {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true })
  taskid: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    enum: ['pending', 'inProcess', 'complete'],
    default: 'pending',
  })
  status: string;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
