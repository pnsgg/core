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
 * Énumération des catégories de produits (merch, boissons ou nourriture)
 */
export const TournamentBracketTypes = [
  'ROUND-ROBIN',
  'SIMPLE',
  'DOUBLE',
  'MATCHMAKING',
  'OTHER',
] as [string, ...string[]];
export const tournamentBracketTypes = pgEnum('tournament_bracket_types', TournamentBracketTypes);

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
  bracketType: tournamentBracketTypes().default('DOUBLE'),
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
export const ProductCategories = ['MERCHANDIZING', 'DRINKS', 'FOOD'] as [string, ...string[]];
export const productCategories = pgEnum('product_categories', ProductCategories);

/**
 * Énumération des unités de mesure possibles pour un produit
 */
export const UnitsOfMeasurement = ['UNIT', 'KILOGRAM', 'LITER'] as [string, ...string[]];
export const unitsOfMeasurement = pgEnum('units_of_measurement', UnitsOfMeasurement);

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
  unitOfMeasurement: unitsOfMeasurement().default('UNIT').notNull(),
  isOnSale: boolean().default(true).notNull(),
  location: text(),
});

export const productsRelations = relations(productsTable, ({ many }) => ({
  sales: many(productSalesTable),
  stockMovements: many(stockMovementsTable),
}));

export const CardPaymentMethods = ['VISA', 'MASTERCARD', 'CB'];
export const OtherPaymentMethods = ['CASH', 'PAYPAL'];

export const PaymentMethods = [...CardPaymentMethods, ...OtherPaymentMethods] as [
  string,
  ...string[],
];

export const paymentMethods = pgEnum('payment_methods', PaymentMethods);

/**
 * Table des ventes.
 * Est considérée une vente l'achat d'un client d'un ou plusieurs produits.
 * Une vente est comme un ticket de caisse.
 * @see productSalesTable
 */
export const salesTable = pgTable('sales', {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp().defaultNow().notNull(),
  paymentMethod: paymentMethods().notNull(),
  stancerId: text(), // ID de référence au paiement sur Stancer, si applicable
  eventId: uuid().references(() => eventsTable.id, { onDelete: 'set null' }),
  stockMovementId: uuid().references(() => stockMovementsTable.id, { onDelete: 'set null' }),
});

export const salesRelations = relations(salesTable, ({ one, many }) => ({
  products: many(productSalesTable),
  event: one(eventsTable, {
    fields: [salesTable.eventId],
    references: [eventsTable.id],
  }),
  stockMovement: one(stockMovementsTable, {
    fields: [salesTable.stockMovementId],
    references: [stockMovementsTable.id],
  }),
}));

/**
 * Table des ventes d'un produit pour une vente.
 * Une ligne de cette table serait équivalente à une ligne sur un ticket de caisse.
 * @see salesTable
 */
export const productSalesTable = pgTable('product_sales', {
  id: uuid().defaultRandom().primaryKey(),
  price: numeric({ precision: 12, scale: 2 }).notNull(),
  quantity: numeric().notNull(),
  index: integer().notNull(),
  productId: uuid()
    .references(() => productsTable.id, { onDelete: 'cascade' })
    .notNull(),
  saleId: uuid()
    .references(() => salesTable.id, { onDelete: 'cascade' })
    .notNull(),
});

export const productSalesRelations = relations(productSalesTable, ({ one }) => ({
  sale: one(salesTable, {
    fields: [productSalesTable.saleId],
    references: [salesTable.id],
  }),
  product: one(productsTable, {
    fields: [productSalesTable.productId],
    references: [productsTable.id],
  }),
}));

export const stockMovementTypes = pgEnum('stock_movement_types', [
  'BUY', // Achat
  'SALE', // Vente
  'LOSS', // Perte
  'RETURN', // Remboursement
]);

/**
 * Table des mouvements d'inventaire (achat, remboursement, perte...).
 * Pour une vente, considérer une ligne sur cette table comme le bilan pour un événement donné
 */
export const stockMovementsTable = pgTable('stock_movements', {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp().defaultNow().notNull(),
  productId: uuid()
    .references(() => productsTable.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: numeric().notNull(),
  price: numeric({ precision: 12, scale: 2 }).notNull(),
  fireflyId: text(), // ID du journal des opérations Firefly III, non nul dans le cadre d'une vente, d'un achat ou d'un remboursement
  eventId: uuid().references(() => eventsTable.id, { onDelete: 'set null' }),
});

export const stockMovementsRelations = relations(stockMovementsTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [stockMovementsTable.productId],
    references: [productsTable.id],
  }),
  sales: many(salesTable),
  event: one(eventsTable, {
    fields: [stockMovementsTable.eventId],
    references: [eventsTable.id],
  }),
}));
