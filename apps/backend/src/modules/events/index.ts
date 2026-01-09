import Elysia from 'elysia';
import { EventsModel } from './model';
import { EventsService } from './service';

export const eventsModule = new Elysia({ prefix: '/events' })
  // GET /events
  // Récupère tous les événements
  .get('/', async () => EventsService.getEvents())
  // POST /events
  // Crée un événement
  .post('/', async ({ body }) => EventsService.createEvent(body), {
    body: EventsModel.createEventsBody,
  })
  // GET /events/:id
  // Récupère un événement
  .get('/:id', async ({ params }) => EventsService.getEvent(params.id))
  // PATCH /events/:id
  // Modifie un événement
  .patch('/:id', async ({ params, body }) => EventsService.modifyEvent(params.id, body), {
    // params: UuidParamsObject,
    body: EventsModel.modifyEventsBody,
  })
  // PATCH /events/:id/tournaments/:id
  .patch(
    '/:id/tournaments/:tid',
    async ({ params, body }) => EventsService.modifyEventTournament(params.id, params.tid, body),
    {
      // params: UuidParamsObject,
      body: EventsModel.modifyEventsBody,
    }
  );
