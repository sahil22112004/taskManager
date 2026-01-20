import { HttpException, Injectable } from '@nestjs/common';
import { createTasksDto } from '../dto/tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { tasksdb ,subtasksdb } from 'src/static/tasks.db';
import { users } from 'src/static/users.db';
import { title } from 'process';

@Injectable()
export class TasksService {
  create(createTaskDto: createTasksDto) {
    const existing = tasksdb?.find((task:any)=>task?.title.toLowerCase() ==createTaskDto.title.toLowerCase())
    if(existing){
      throw new HttpException(
      {
      message:'this title is already existed',
      status:404
   },404  );
      }
    const userexisting = users.find((user:any)=>user?.id==createTaskDto.userid)
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
    const task ={
      id:Date.now(),
      title:createTaskDto.title,
      userId:createTaskDto.userid,
      status:'pending',
      startTime:createTaskDto.startTime,
      endTime:createTaskDto.endTime
    }
    tasksdb && tasksdb.push(task);
    {createTaskDto.subtasks.map((subtask)=>{
      const subtaskobj = {
      id:Date.now(),
      taskid:task.id,
      title:subtask.title,
      status:'pending'
    }
    subtasksdb && subtasksdb.push(subtaskobj);
    })

    return 'Task Added Succesfully';
  }}

  findAll() {
    let allTasks:any = []
    tasksdb.map((task:any)=>{
      const taskobj={
        id:task.id,
        title:task.title,
        userId:task.userId,
        status:task.status,
        startTime:task.startTime,
        endTime:task.endTime,
        subtasks:subtasksdb.filter((subtask:any)=>subtask.taskid==task.id).sort()
      }
      allTasks.push(taskobj)
    })

    
    return allTasks
  }

  findOne(id: number) {
    const filtered = tasksdb?.find((task:any)=>task?.id ==id)
    if(!filtered){
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    const taskobj={
      ...filtered,
      subtasks:subtasksdb.filter((subtask:any)=>subtask.taskid==filtered.id).sort()
    }
        console.log(taskobj)
    return taskobj

  }

  updateToComplete(id: number) {
    const Index = tasksdb.findIndex((task:any) => task.id === id);
    if (Index === -1) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(tasksdb[Index].status == 'pending'){
      throw new HttpException(
      {
      message:'Cannot directly change to complete',
      status:422
   },422
  );
    }
    if(tasksdb[Index].status == 'completed'){
      throw new HttpException(
      {
      message:'task is already completed',
      status:422
   },422
  );
    }
    const inProcessSubtask = subtasksdb.find((subtask:any)=>subtask.taskid==id && subtask.status!='complete')
    if(inProcessSubtask){
      throw new HttpException(
      {
      message:'Can not Complete untill all sub Task are completed',
      status:422
   },422
  );
    }
    tasksdb[Index] = { ...tasksdb[Index], status:'complete' };
    return `update change to completed`;
  }
   updateToPending(id: number) {
    const Index = tasksdb.findIndex((task:any) => task.id === id);
    if (Index === -1) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(tasksdb[Index].status == 'pending'){
      throw new HttpException(
      {
      message:'task is already pending',
      status:422
   },422
  );
    }
    if(tasksdb[Index].status == 'complete'){
      throw new HttpException(
      {
      message:'task is already completed',
      status:422
   },422
  );
    }

    tasksdb[Index] = { ...tasksdb[Index], status:'pending' };
    return `update change to pending`;
  }
   updateToInprocess(id: number) {
    const Index = tasksdb.findIndex((task:any) => task.id === id);
    if (Index === -1) {
      throw new HttpException(
     {
      message:'no task found',
      status:404
   },404
  );
    }
    if(tasksdb[Index].status == 'inProcess'){
      throw new HttpException(
      {
      message:'task is already inProcess',
      status:422
   },422
  );
    }
    if(tasksdb[Index].status == 'complete'){
      throw new HttpException(
      {
      message:'task is already completed',
      status:422
   },422
  );
    }
    tasksdb[Index] = { ...tasksdb[Index], status:'inProcess' };
    return `update change to in process`;
  }
  subtaskupdateToComplete(id: number) {
    const Index = subtasksdb.findIndex((task:any) => task.id === id);
    if (Index === -1) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(subtasksdb[Index].status == 'pending'){
      throw new HttpException(
      {
      message:'cannot directly change to completed',
      status:422
   },422
  );
    }
    if(subtasksdb[Index].status == 'complete'){
      throw new HttpException(
      {
      message:'subtask is already complete',
      status:422
   },422
  );
    }
    subtasksdb[Index] = { ...subtasksdb[Index], status:'complete' };
    return `update change to completed`;
  }
   subtaskupdateToPending(id: number) {
    const Index = subtasksdb.findIndex((task:any) => task.id === id);
    if (Index === -1) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(subtasksdb[Index].status == 'pending'){
      throw new HttpException(
      {
      message:'subtask is already pending',
      status:422
   },422
  );
    }
    if(subtasksdb[Index].status == 'complete'){
      throw new HttpException(
      {
      message:'subtask is already completed',
      status:422
   },422
  );
    }
    subtasksdb[Index] = { ...subtasksdb[Index], status:'pending' };
    return `update change to pending`;
  }
   subtaskupdateToInprocess(id: number) {
    const Index = subtasksdb.findIndex((task:any) => task.id === id);
    if (Index === -1) {
      throw new HttpException(
      {
      message:'no task found',
      status:404
   },404
  );
    }
    if(subtasksdb[Index].status == 'inProcess'){
      throw new HttpException(
      {
      message:'subtask is already inProcess',
      status:422
   },422
  );
    }
    if(subtasksdb[Index].status == 'complete'){
      throw new HttpException(
      {
      message:'subtask is already completed',
      status:422
   },422
  );
    }
    subtasksdb[Index] = { ...subtasksdb[Index], status:'inProcess' };
    return `Succesfully mark status to in Process`;
  }
  
  remove(id: number) {
    const index = tasksdb.findIndex((task:any)=>task.id==id)
    if(index == -1){
      throw new HttpException(
      {
      message:'No task found to delelte',
      status:404
   },404
  );
    }
    tasksdb.splice(index,1)
    for (let i =0;i<=subtasksdb.length-1;i++){
      console.log('len :',subtasksdb.length)
      if(subtasksdb[i].taskid==id){
        subtasksdb.splice(i,1)
        console.log('subtask',subtasksdb)
        console.log('len :',subtasksdb.length)
      }
    }
     return subtasksdb
  }

}

