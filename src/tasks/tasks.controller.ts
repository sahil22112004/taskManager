import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { createTasksDto } from './dto/tasks.dto';
import type { TaskQuery } from './interface/querInterface';
import { Query } from '@nestjs/common';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: createTasksDto) {  
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() query: TaskQuery) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id/markCompleted')
  updateToComplete(@Param('id') id: string) {
    return this.tasksService.updateToComplete(id);
  }

  @Patch(':id/markPending')
  updateToPending(@Param('id') id: string) {
    return this.tasksService.updateToPending(id);
  }

  @Patch(':id/markInProcess')
  updateToInprocess(@Param('id') id: string) {
    return this.tasksService.updateToInprocess(id);
  }

  @Patch('subtask/:id/markCompleted')
  subtaskupdateToComplete(@Param('id') id: string) {
    return this.tasksService.subtaskupdateToComplete(id);
  }

  @Patch('subtask/:id/markPending')
  subtaskupdateToPending(@Param('id') id: string) {
    return this.tasksService.subtaskupdateToPending(id);
  }

  @Patch('subtask/:id/markInProcess')
  subtaskupdateToInprocess(@Param('id') id: string) {
    return this.tasksService.subtaskupdateToInprocess(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
