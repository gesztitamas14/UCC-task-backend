import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

export class CreateEventDto {
  title: string;
  occurrence_datetime: string; // string marad
  description?: string;
}

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  getEvents(@Req() req) {
    return this.eventsService.findAllByUser(req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createEvent(@Req() req, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(req.user, createEventDto);
  }
  @Patch(':id')
  updateDescription(@Req() req, @Param('id') id: string, @Body('description') description: string) {
    return this.eventsService.updateDescription(+id, req.user, description);
  }

  @Delete(':id')
  deleteEvent(@Req() req, @Param('id') id: string) {
    return this.eventsService.remove(+id, req.user);
  }
}
