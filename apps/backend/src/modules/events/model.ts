import { TournamentBracketTypes } from '@/utils/db/schema';
import { t } from 'elysia';

export namespace EventsModel {
  export const createTournamentsBody = t.Object({
    startggId: t
      .Transform(
        t.Numeric({
          minimum: 1,
        }),
      )
      .Decode((e) => e.toString())
      .Encode((e) => parseInt(e)),
    name: t.String(),
    slots: t.Number({
      minimum: 2,
    }),
    bracketType: t.UnionEnum(TournamentBracketTypes, {
      default: undefined,
    }),
  });

  export const createEventsBody = t.Object({
    startggId: t
      .Transform(
        t.Numeric({
          minimum: 1,
        }),
      )
      .Decode((e) => e.toString())
      .Encode((e) => parseInt(e)),
    name: t.String(),
    slug: t.String(),
    startsAt: t.Date(),
    endsAt: t.Date(),
    seriesId: t.String({
      format: 'uuid',
    }),
    shortDescription: t.Optional(t.String()),
    longDescription: t.Optional(t.String()),
    locationText: t.String(),
    totalSlots: t.Number({
      minimum: 2,
    }),
    maximumParticipationFee: t.Number({
      minimum: 0,
    }),
    tournaments: t.Array(createTournamentsBody, { minItems: 1, uniqueItems: true }),
  });

  export type CreateEventBody = typeof createEventsBody.static;

  export const modifyEventsBody = t.Object({
    name: t.String(),
    startsAt: t.Date(),
    endsAt: t.Date(),
    seriesId: t.String({
      format: 'uuid',
    }),
    shortDescription: t.Optional(t.String()),
    longDescription: t.Optional(t.String()),
    locationText: t.String(),
    totalSlots: t.Number({
      minimum: 2,
    }),
    maximumParticipationFee: t.Number({
      minimum: 0,
    }),
  });

  export type ModifyEventBody = typeof modifyEventsBody.static;

  export const modifyTournamentsBody = t.Object({
    name: t.Optional(t.String()),
    slots: t.Optional(
      t.Number({
        minimum: 2,
      }),
    ),
    bracketType: t.Optional(
      t.UnionEnum(TournamentBracketTypes, {
        default: undefined,
      }),
    ),
  });

  export type ModifyTournamentBody = typeof modifyTournamentsBody.static;
}
