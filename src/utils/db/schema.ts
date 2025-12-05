import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Énumération des rôles attribuables à un utilisateur
 */
export const UserRoles = ['TO'] as [string, ...string[]];
export const userRoles = pgEnum('user_roles', UserRoles);

/**
 * Tables des utilisateurs
 */
export const usersTable = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull().unique(),
  role: userRoles().notNull(),
});

/**
 * Table des séries d'événements
 */
export const seriesTable = pgTable('series', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
});

export const seriesRelations = relations(seriesTable, ({ many }) => ({
  events: many(eventsTable),
}));

/**
 * Table des événements partiels (appelés tournaments sur l'API start.gg)
 */
export const eventsTable = pgTable('events', {
  id: uuid().defaultRandom().primaryKey(),
  startggId: text().unique().notNull(),
  name: text().notNull(),
  startsAt: timestamp().notNull(),
  endsAt: timestamp().notNull(),
  seriesId: uuid()
    .references(() => seriesTable.id, { onDelete: 'cascade' })
    .notNull(),
  shortDescription: text(),
  longDescription: text(),
  locationText: text().notNull(),
  totalSlots: integer().notNull(),
  maximumParticipationFee: integer(),
});

export const eventsRelations = relations(eventsTable, ({ one, many }) => ({
  series: one(seriesTable, {
    fields: [eventsTable.seriesId],
    references: [seriesTable.id],
  }),
  feeDiscounts: many(feeDiscountsTable),
  tournaments: many(tournamentsTable),
}));

/**
 * Table des tournois partiels (appelés events sur l'API start.gg)
 */
export const tournamentsTable = pgTable('tournaments', {
  id: uuid().defaultRandom().primaryKey(),
  startggId: text().unique().notNull(),
  name: text().notNull(),
  eventId: uuid()
    .references(() => eventsTable.id, { onDelete: 'cascade' })
    .notNull(),
  slots: integer().notNull(),
  bracketType: text({
    enum: ['ROUND-ROBIN', 'SIMPLE', 'DOUBLE', 'MATCHMAKING', 'OTHER'],
  }).default('DOUBLE'),
});

export const tournamentsRelations = relations(tournamentsTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [tournamentsTable.eventId],
    references: [eventsTable.id],
  }),
}));

/**
 * Table des réductions sur frais d'inscription
 */
export const feeDiscountsTable = pgTable('fee_discounts', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  amount: integer().notNull(),
  eventId: uuid()
    .references(() => eventsTable.id, { onDelete: 'cascade' })
    .notNull(),
});

export const feeDiscountsRelations = relations(feeDiscountsTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [feeDiscountsTable.eventId],
    references: [eventsTable.id],
  }),
}));
