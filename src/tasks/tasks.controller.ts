import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/userDecorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(): Promise<Task[]> {
    const tasks = await this.tasksService.getAllTasks();
    return tasks;
  }

  @Post('/create')
  async createTask(@Body() task: Task, @GetUser() user: User) {
    return this.tasksService.createTask(task, user.id);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string, @GetUser() user: User) {
    await this.tasksService.deleteTask(id, user.id);
  }
}
