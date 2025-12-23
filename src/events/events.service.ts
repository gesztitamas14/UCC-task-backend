import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from './events.controller';

type JwtUser = { userId: number; email: string; role: string };

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}
  

  async create(user: JwtUser, data: CreateEventDto) {
    const event = this.eventsRepository.create({
      title: data.title,
      occurrence_datetime: new Date(data.occurrence_datetime),
      description: data.description,
      user: { id: user.userId } as User,
    });

    try {
      const savedEvent = await this.eventsRepository.save(event);
      return savedEvent;
    } catch (err) {
      console.error('Error saving event:', err);
      throw err;
    }
  }

  async findAllByUser(user: JwtUser) {
    return this.eventsRepository.find({
      where: { user: { id: user.userId } },
      relations: ['user'],
    });
  }

  findOne(id: number, user: JwtUser) {
    return this.eventsRepository.findOne({
      where: { id, user: { id: user.userId } },
    });
  }

  async updateDescription(id: number, user: JwtUser, description: string) {
    const event = await this.findOne(id, user);
    if (!event) return null;
    event.description = description;
    return this.eventsRepository.save(event);
  }

  async remove(id: number, user: JwtUser) {
    const event = await this.findOne(id, user);
    if (!event) return null;
    return this.eventsRepository.remove(event);
  }
}
