import { createTrigger } from '@linkerry/connectors-framework';
import { TriggerStrategy } from '@linkerry/shared';
import { telegramBotAuth } from '../common/auth';
import { telegramCommons } from '../common/common';

export const telegramNewMessage = createTrigger({
  auth: telegramBotAuth,
  name: 'new_telegram_message',
  displayName: 'New message',
  description: 'Triggers when Telegram receives a new message',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    body: {
      message: {
        chat: {
          id: 65369545042,
          type: 'private',
          username: 'JohnDone',
          last_name: 'Done',
          first_name: 'John',
        },
        date: 1700045151,
        from: {
          id: 63269783040,
          is_bot: false,
          username: 'JohnDone',
          last_name: 'Done',
          first_name: 'John',
          language_code: 'en',
        },
        parse_mode: 'MarkdownV2',
        text: 'Hi Friend !',
        message_id: 1,
      },
      update_id: 761344522,
    },
  },
  async onEnable(context) {
    await telegramCommons.subscribeWebhook(context.auth, context.webhookUrl, {
      allowed_updates: [],
    });
  },
  async onDisable(context) {
    await telegramCommons.unsubscribeWebhook(context.auth);
  },
  async run(context) {
    return [context.payload.body];
  }
});
