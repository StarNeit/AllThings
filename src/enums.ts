// Locales
export enum Locale {
  de_DE = 'de_DE',
  en_US = 'en_US',
  fr_FR = 'fr_FR',
  it_IT = 'it_IT',
  nl_NL = 'nl_NL',
  pt_PT = 'pt_PT',
}

// MicroApps
export enum MicroApps {
  ARCHILOGIC = 'archilogic',
  BOOKING = 'booking',
  CONCIERGE = 'concierge',
  CLIPBOARD = 'clipboard',
  COBOT = 'cobot',
  CONSUMPTION = 'consumption',
  CRAFTSPEOPLE = 'craftspeople',
  DOCUMENTS = 'documents',
  E_CONCIERGE = 'e-concierge',
  EXTERNAL_CONTENT = 'external-content',
  EXTERNAL_LINK = 'external-link',
  FALLBACK = '__fallback__',
  HELPDESK = 'helpdesk',
  MARKETPLACE = 'marketplace',
  MY_CONTRACTS = 'my-contracts',
  PINBOARD = 'community-articles',
  PROJECT = 'project',
  SETTINGS = 'settings',
  SHARING = 'sharing',
  UNIT = 'unit',
  WHO_IS_WHO = 'who-is-who',
}

// Ticket statuses.
export enum TicketStatus {
  CLOSED = 'closed',
  WAITING_FOR_AGENT = 'waiting-for-agent',
  WAITING_FOR_CUSTOMER = 'waiting-for-customer',
  WAITING_FOR_EXTERNAL = 'waiting-for-external',
}

// Ticket conversation message types.
export enum ConversationMessageType {
  FILE = 'file',
  TEXT = 'text',
}

// Payment statuses.
export enum PaymentStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PENDING_MANUAL = 'pending_manual',
  PENDING_STRIPE = 'pending_stripe',
  CANCELLED = 'cancelled',
  ABANDONED = 'abandoned',
  MANUAL_ACTION_NEEDED = 'manual_action_needed',
}
