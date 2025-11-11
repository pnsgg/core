import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

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

/**
 * Énumération des catégories de produits (merch, boissons ou nourriture)
 */
export const productCategories = pgEnum('product_categories', ['MERCHANDIZING', 'DRINKS', 'FOOD']);

/**
 * Énumération des unités de mesure possibles pour un produit
 */
export const unitsOfMeasurement = pgEnum('units_of_measurement', ['UNIT', 'KILOGRAM', 'LITER']);

/**
 * Table des produits (une ligne = un ensemble du même produit, pas une unité de produit)
 */
export const productsTable = pgTable('products', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  allergens: text(),
  price: numeric({ precision: 12, scale: 2 }).notNull(),
  category: productCategories().notNull(),
  quantity: numeric().notNull(),
  unitOfMeasurement: unitsOfMeasurement().default('UNIT'),
  isActive: boolean().default(true),
  location: text(),
});

export const paymentMethods = pgEnum('payment_methods', [
  'CASH',
  'PAYPAL',
  'VISA',
  'MASTERCARD',
  'CB',
]);

/**
 * Table des transactions de produits (une transaction par produit)
 */
export const transactionsTable = pgTable('transactions', {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp().defaultNow(),
  productId: uuid().references(() => productsTable.id, { onDelete: 'cascade' }),
  price: numeric({ precision: 12, scale: 2 }).notNull(),
  quantity: numeric().notNull(),
  paymentMethod: paymentMethods().notNull(),
  stancerId: text(), // ID de référence au paiement sur Stancer, si applicable
  eventId: uuid().references(() => eventsTable.id, { onDelete: 'set null' }),
});

export const transactionsRelations = relations(transactionsTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [transactionsTable.productId],
    references: [productsTable.id],
  }),
  event: one(eventsTable, {
    fields: [transactionsTable.eventId],
    references: [eventsTable.id],
  }),
}));

export const stockMovementTypes = pgEnum('stock_movement_types', [
  'IN',
  'OUT',
  'ADJUSTMENT',
  'SALE',
  'RETURN',
]);

/**
 * Table des mouvements d'inventaire (ajouts, retraits, ventes)
 */
export const stockMovementsTable = pgTable('stock_movements', {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp().defaultNow(),
  productId: uuid().references(() => productsTable.id, { onDelete: 'cascade' }),
  quantity: numeric().notNull(),
  price: numeric({ precision: 12, scale: 2 }).notNull(),
  fireflyId: text(), // ID du journal des opérations Firefly III
  transactionId: uuid().references(() => transactionsTable.id, { onDelete: 'set null' }),
  eventId: uuid().references(() => eventsTable.id, { onDelete: 'set null' }),
});

export const stockMovementsRelations = relations(stockMovementsTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [stockMovementsTable.productId],
    references: [productsTable.id],
  }),
  transaction: one(transactionsTable, {
    fields: [stockMovementsTable.transactionId],
    references: [transactionsTable.id],
  }),
  event: one(eventsTable, {
    fields: [stockMovementsTable.eventId],
    references: [eventsTable.id],
  }),
}));
