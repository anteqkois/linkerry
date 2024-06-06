import { createConnector } from '@linkerry/connectors-framework'
import { fakturowniaCreateInvoice } from './actions/create-invoice'
import { faktorowniaAuth } from './common/auth'
import { fakturowniaSendInvoiceEmail } from './actions/send-invoice-email'

export const telegramBot = createConnector({
  displayName: 'Fakturownia',
  description: 'Using Fakturownia, you can generate, manage, and send invoices efficiently through a user-friendly platform',
  descriptionLong:
    'Fakturownia is a comprehensive invoicing platform that allows users to create, manage, and send invoices, as well as handle various accounting tasks. The platform supports multiple currencies and languages, automates recurring invoices, integrates with popular accounting software, and provides features for inventory management, client database maintenance, and detailed financial reporting. This makes it an ideal solution for businesses looking to streamline their billing processes and maintain accurate financial records.',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/fakturownia.png',
  tags: ['data management', 'office', 'payments'],
  auth: faktorowniaAuth,
  actions: [
    fakturowniaCreateInvoice,
    fakturowniaSendInvoiceEmail
    // createCustomApiCallAction({
    //   baseUrl: (auth) => telegramCommons.getApiUrl(auth as string, ''),
    //   auth: faktorowniaAuth,
    // }),
  ],
  triggers: [],
})
