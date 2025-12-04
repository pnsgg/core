import Elysia from 'elysia';
import { EventsModel } from './model';
import { EventsService } from './service';

export const eventsModule = new Elysia({ prefix: '/events' })
  // GET /events
  // Récupère tous les produits
  .get('/', async () => EventsService.getEvents())
  // POST /events
  // Crée un produit
  .post('/', async ({ body }) => EventsService.createEvent(body), {
    body: EventsModel.createEventsBody,
  });
// GET /events/:id
// Récupère un produit
// .get('/:id', async ({ params }) => EventsService.getEvent(params.id), {
//   params: UuidParamsObject,
// })
// // PATCH /events/:id
// // Modifie un produit
// .patch('/:id', async ({ params, body }) => EventsService.modifyEvent(params.id, body), {
//   params: UuidParamsObject,
//   // body: EventsModel.modi,
// })
