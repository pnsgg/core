export namespace FireflyIII {
  export type DateString = string;

  export interface PartialTransaction {
    transaction_journal_id: string;
    type: 'withdrawal' | 'deposit';
    date: DateString;
    order: number;
    currency_code: 'EUR';
    currency_name: 'Euro';
    currency_symbol: '€';
    currency_decimal_places: 2;
    amount: string;
    dscription: string;
    source_name: string;
    source_type: string;
    destination_name: string;
    destination_type: string;
    category_name: string | null;
    notes: string | null;
    tags: string[];
  }

  export interface PartialAPIGetTransactionResponse {
    data: {
      type: 'transactions';
      id: string;
      attributes: {
        created_at: DateString;
        updated_at: DateString;
        transactions: PartialTransaction[];
      };
      links: {
        self: string;
      };
    }[];
  }
}
