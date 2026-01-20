import { HttpException, Injectable } from '@nestjs/common';
import { createTasksDto } from './dto/tasks.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/tasks.schema';
import { Subtask } from './schemas/subtasks.schema';
import { User } from './schemas/users.schema';
import type { TaskQuery } from './interface/querInterface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Subtask.name) private subtaskModel: Model<Subtask>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createTaskDto: createTasksDto) {
    const existing = await this.taskModel.findOne({ title: createTaskDto.title.toLowerCase() });
    if(existing){
      throw new HttpException(
      {
      message:'this title is already existed',
      status:404
   },404  );
      }
    const userexisting = await this.userModel.findById(createTaskDto.userid);
    if(!userexisting){
      throw new HttpException(
      {
      message:'no such user existed',
      status:404
   },404
  );
    }
    if(createTaskDto.startTime>createTaskDto.endTime){
      throw new HttpException(
      {
      message:'start time should be smaller than end time',
      status:404
   },404
  );
      }
    const task = await this.taskModel.create({
      title:createTaskDto.title,
      userId:createTaskDto.userid,
      status:'pending',
      startTime:new Date(createTaskDto.startTime),
      endTime:new Date(createTaskDto.endTime)
    })
    await Promise.all(
      createTaskDto.subtasks.map(async (subtask) => {
        await this.subtaskModel.create({
          taskid:task._id,
          title:subtask.title,
          status:'pending'
        })
      })
    )
    return 'Task Added Succesfully';
  }

  async findAll(query: TaskQuery) {
    const { limit = 10, skip = 0 } = query

    let allTasks:any = []
    const tasks = await this.taskModel.find().limit(Number(limit)).skip(Number(skip));
    const subtasks = await this.subtaskModel.find()
    tasks.map((task:any)=>{
      const taskobj={
        id:task._id,
        title:task.title,
        userId:task.userId,
        status:task.status,
        startTime:task.startTime,
        endTime:task.endTime,
        subtasks:subtasks.filter((subtask:any)=>subtask.taskid.toString()==task._id.toString()).sort()
      }
      allTasks.push(taskobj)
    })
    return allTasks
  }

  async findOne(id: string) {
    const filtered = await this.taskModel.findById(id)
    if(!filtered){
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    const subtasks = await this.subtaskModel.find({ taskid:id })
    const taskobj={
      ...filtered.toObject(),
      subtasks:subtasks.sort()
    }
    return taskobj
  }

  async updateToComplete(id: string) {
    const task = await this.taskModel.findById(id)
    if (!task) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(task.status == 'pending'){
      throw new HttpException(
      {
      message:'Cannot directly change to complete',
      status:422
   },422
  );
    }
    if(task.status == 'complete'){
      throw new HttpException(
      {
      message:'task is already completed',
      status:422
   },422
  );
    }
    const inProcessSubtask = await this.subtaskModel.findOne({ taskid:id, status:{ $ne:'complete' } })
    if(inProcessSubtask){
      throw new HttpException(
      {
      message:'Can not Complete untill all sub Task are completed',
      status:422
   },422
  );
    }
    await this.taskModel.findByIdAndUpdate(id,{ status:'complete' })
    return `update change to completed`;
  }

  async updateToPending(id: string) {
    const task = await this.taskModel.findById(id)
    if (!task) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(task.status == 'pending'){
      throw new HttpException(
      {
      message:'task is already pending',
      status:422
   },422
  );
    }
    if(task.status == 'complete'){
      throw new HttpException(
      {
      message:'task is already completed',
      status:422
   },422
  );
    }
    await this.taskModel.findByIdAndUpdate(id,{ status:'pending' })
    return `update change to pending`;
  }

  async updateToInprocess(id: string) {
    const task = await this.taskModel.findById(id)
    if (!task) {
      throw new HttpException(
     {
      message:'no task found',
      status:404
   },404
  );
    }
    if(task.status == 'inProcess'){
      throw new HttpException(
      {
      message:'task is already inProcess',
      status:422
   },422
  );
    }
    if(task.status == 'complete'){
      throw new HttpException(
      {
      message:'task is already completed',
      status:422
   },422
  );
    }
    await this.taskModel.findByIdAndUpdate(id,{ status:'inProcess' })
    return `update change to in process`;
  }

  async subtaskupdateToComplete(id: string) {
    const subtask:any = await this.subtaskModel.findById(id)
    if (!subtask) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(subtask.status == 'pending'){
      throw new HttpException(
      {
      message:'cannot directly change to completed',
      status:422
   },422
  );
    }
    if(subtask.status == 'complete'){
      throw new HttpException(
      {
      message:'subtask is already complete',
      status:422
   },422
  );
    }
    await this.subtaskModel.findByIdAndUpdate(id,{ status:'complete' })
    return `update change to completed`;
  }

  async subtaskupdateToPending(id: string) {
    const subtask:any = await this.subtaskModel.findById(id)
    if (!subtask) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(subtask.status == 'pending'){
      throw new HttpException(
      {
      message:'subtask is already pending',
      status:422
   },422
  );
    }
    if(subtask.status == 'complete'){
      throw new HttpException(
      {
      message:'subtask is already completed',
      status:422
   },422
  );
    }
    await this.subtaskModel.findByIdAndUpdate(id,{ status:'pending' })
    return `update change to pending`;
  }

  async subtaskupdateToInprocess(id: string) {
    const subtask:any = await this.subtaskModel.findById(id)
    if (!subtask) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(subtask.status == 'inProcess'){
      throw new HttpException(
      {
      message:'subtask is already inProcess',
      status:422
   },422
  );
    }
    if(subtask.status == 'complete'){
      throw new HttpException(
      {
      message:'subtask is already completed',
      status:422
   },422
  );
    }
    await this.subtaskModel.findByIdAndUpdate(id,{ status:'inProcess' })
    return `Succesfully mark status to in Process`;
  }

  async remove(id: string) {
    const task = await this.taskModel.findById(id)
    if(!task){
      throw new HttpException(
      {
      message:'No task found to delelte',
      status:404
   },404
  );
    }
    await this.taskModel.findByIdAndDelete(id)
    await this.subtaskModel.deleteMany({ taskid:id })
    return 'Task deletd succesfully'
  }

}
