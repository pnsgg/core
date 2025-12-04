import { db } from '@/utils/db';
import { eventsTable, tournamentsTable } from '@/utils/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { status } from 'elysia';
import { SeriesService } from '../series/service';
import { EventsModel } from './model';

export abstract class EventsService {
  static async getEvents() {
    return await db.query.eventsTable.findMany();
  }

  static async getEvent(id: string) {
    return {};
  }

  static async createEvent(data: EventsModel.CreateEventBody) {
    if (data.tournaments.some((t) => t.slots > data.totalSlots)) {
      throw status(400, "Au moins un tournoi propose plus de place que le total de l'événement.");
    }

    const startggIds = new Set(data.tournaments.map((t) => t.startggId));
    if (startggIds.size !== data.tournaments.length) {
      throw status(400, "Les identifiants Start.gg d'un ou plusieurs tournois sont identiques.");
    }

    if (data.endsAt.getTime() <= data.startsAt.getTime()) {
      throw status(
        400,
        "La date de fin de l'événement ne peut pas être antérieure à la date de début.",
      );
    }

    const series = await SeriesService.getSeries(data.seriesId);
    if (!series) {
      throw status(404, 'Série non trouvée.');
    }

    const eventByStartggID = await db.query.eventsTable.findFirst({
      where: eq(eventsTable.startggId, data.startggId),
    });
    if (eventByStartggID) {
      throw status(400, 'Un tournoi avec cet identifiant Start.gg existe déjà.');
    }

    const [createdEvent] = await db.insert(eventsTable).values(data).returning();

    const { eventId, ...returning } = getTableColumns(tournamentsTable);
    const createdTournaments = await db
      .insert(tournamentsTable)
      .values(
        data.tournaments.map((t) => ({
          ...t,
          eventId: createdEvent.id,
        })),
      )
      .returning(returning);

    return status(201, { ...createdEvent, tournaments: createdTournaments });
  }

  static async modifyEvent(id: string) {
    return {};
  }
}
