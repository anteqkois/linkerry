import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { Property } from '@linkerry/connectors-framework'
import { Channel, Guild } from '../common/models'
import { webhookUrl } from './instructions'

export interface Member {
  user: {
    id: string
    username: string
  }
}

export const discordCommon = {
  channel: Property.DynamicDropdown<true, string>({
    displayName: 'Channel',
    description: 'Select a specific channel from your Discord server.',
    required: true,
    refreshers: [],
    options: async ({ auth }) => {
      if (!auth) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please connect your bot first',
        }
      }

      const request = {
        method: HttpMethod.GET,
        url: 'https://discord.com/api/v9/users/@me/guilds',
        headers: {
          Authorization: 'Bot ' + auth,
        },
      }

      const res = await httpClient.sendRequest<Guild[]>(request)
      const options: { options: { value: string; label: string }[] } = {
        options: [],
      }

      if (res.body.length === 0)
        return {
          disabled: true,
          options: [],
          placeholder: 'No guilds found, please add the bot to a guild first',
        }

      await Promise.all(
        res.body.map(async (guild) => {
          const requestChannels = {
            method: HttpMethod.GET,
            url: 'https://discord.com/api/v9/guilds/' + guild.id + '/channels',
            headers: {
              Authorization: 'Bot ' + auth,
            },
          }

          const resChannels = await httpClient.sendRequest<Channel[]>(requestChannels)
          resChannels.body.forEach((channel) => {
            options.options.push({
              value: channel.id,
              label: channel.name,
            })
          })
        }),
      )

      return options
    },
  }),
  roles: Property.DynamicDropdown<true, string>({
    displayName: 'Roles',
    description: 'Select a role to assign from the available roles in the guild.',
    required: true,
    refreshers: ['guild_id'],
    options: async ({ auth, guild_id }) => {
      if (!auth) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please connect your bot first',
        }
      }

      if (!guild_id) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please select a guild first',
        }
      }

      const request = {
        method: HttpMethod.GET,
        url: `https://discord.com/api/v9/guilds/${guild_id}/roles`,
        headers: {
          Authorization: 'Bot ' + auth,
        },
      }

      const res = await httpClient.sendRequest<Guild[]>(request)

      const options: { options: { value: string; label: string }[] } = {
        options: [],
      }

      if (res.body.length === 0)
        return {
          disabled: true,
          options: [],
          placeholder: 'No roles found, please add the bot to a guild first',
        }

      await Promise.all(
        res.body.map(async (role) => {
          options.options.push({
            value: role.id,
            label: role.name,
          })
        }),
      )

      return options
    },
  }),
  guilds: Property.DynamicDropdown<true, string>({
    displayName: 'Guilds',
    description: 'Select a guild from the list of your available guilds.',
    required: true,
    refreshers: [],
    options: async ({ auth }) => {
      if (!auth) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please connect your bot first',
        }
      }

      const request = {
        method: HttpMethod.GET,
        url: 'https://discord.com/api/v9/users/@me/guilds',
        headers: {
          Authorization: 'Bot ' + auth,
        },
      }

      const res = await httpClient.sendRequest<Guild[]>(request)
      const options: { options: { value: string; label: string }[] } = {
        options: [],
      }

      if (res.body.length === 0)
        return {
          disabled: true,
          options: [],
          placeholder: 'No guilds found, please add the bot to a guild first',
        }

      await Promise.all(
        res.body.map(async (guild) => {
          options.options.push({
            value: guild.id,
            label: guild.name,
          })
        }),
      )

      return options
    },
  }),
  instructions_webhook_url: Property.MarkDown({
    displayName: 'Obtaining Webhook URL',
    description: webhookUrl,
  }),
  webhook_url: Property.ShortText({
    displayName: 'Webhook URL',
    description: 'Enter the webhook URL for your Discord server.',
    required: true,
  }),
}
