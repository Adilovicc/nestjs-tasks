import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Task } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  async deleteTask(taskId: string, userId: string): Promise<string> {
    const result = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
    });

    if (!result) {
      throw new BadRequestException({ message: 'Task doesnt exist' });
    }
    if (result.id != userId) {
      throw new UnauthorizedException({
        message: 'You dont have permission for this action!',
      });
    }
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return 'Task successfully deleted';
  }

  async createTask(task: Task, _uid: string): Promise<Task | string> {
    const result = await this.prisma.task.create({
      data: {
        id: task.id,
        status: task.status,
        description: task.description,
        title: task.title,
        authorId: _uid,
      },
    });

    if (!result) {
      throw new BadRequestException({ message: 'Something went wrong' });
    }
    return result;
  }
}
