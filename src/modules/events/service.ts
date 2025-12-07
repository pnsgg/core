import { db } from '@/utils/db';
import { eventsTable, tournamentsTable } from '@/utils/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { status } from 'elysia';
import { SeriesService } from '../series/service';
import { EventsModel } from './model';

export abstract class EventsService {
  static async getEvents() {
    return await db.query.eventsTable.findMany();
  }

  static async getEvent(id: string) {
    return await db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, id),
    });
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

  static async modifyEvent(id: string, data: EventsModel.ModifyEventBody) {
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

    const [updatedEvent] = await db
      .update(eventsTable)
      .set(data)
      .where(eq(eventsTable.id, id))
      .returning({
        id: eventsTable.id,
      });

    if (!updatedEvent) {
      throw status(404);
    }

    return updatedEvent;
  }

  static async modifyTournament(id: string, tid: string, data: EventsModel.ModifyTournamentBody) {
    const event = await db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, id),
      with: {
        tournaments: {
          where: eq(tournamentsTable.id, tid),
        },
      },
    });

    if (!event) {
      throw status(404, 'Événement non trouvé');
    }
    if (!event.tournaments) {
      throw status(404, 'Tournoi non trouvé pour cette événement');
    }

    const [updatedTournament] = await db
      .update(tournamentsTable)
      .set(data)
      .where(and(eq(tournamentsTable.id, tid), eq(tournamentsTable.eventId, id)))
      .returning({
        id: tournamentsTable.id,
      });

    if (!updatedTournament) {
      throw status(404);
    }

    return updatedTournament;
  }
}
