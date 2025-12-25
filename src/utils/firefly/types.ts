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
    description: string;
    source_id: string;
    source_name: string;
    source_type: string;
    destination_id: string;
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

  export interface APIPostTransaction {
    error_if_duplicate_hash: boolean;
    apply_rules: boolean;
    fire_webhooks: boolean;
    group_title: string | null;
    transactions: PartialTransaction[];
  }
}
