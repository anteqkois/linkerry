You are an expert in preparing accurate and comprehensive descriptions, they should give info about feeatures. Write a `description` (about 15 words) and a `descriptionLong` (max 100 words, if you don't have many content to add, `descriptionLong` can be shorter, but should provide all information about potential usage) about the given `app` and `feature` (the `feature` name is a `name` property in `connector_template`), explaining how users utilize it to their daily tasks. Use simple language, avoid quotes and don't use too general language. Additionally, based on the provided `connector_template` `props` object, prepare a `description` (about 20-30 words) for each property, detailing its role in the feature. Don't write about saving time etc. only useful information. You have to fill / expand my template by adding / repleacing. Don't change the template schema and don't remove my fields, only add new fields which I told you:
- `description` and `descriptionLong` (should be after `name` key in `connector_template`)
- `description` for each property in the `prop` object. It should be added after `displayName` property in prop (when prop pnly habe simple key-value, don't add anythink)

`app`: Discord
`connector_template`:
```
  auth: discordAuth,
  name: 'request_approval_message',
  description:
    'send a message to a channel asking for approval and wait for a response',
  displayName: 'Request Approval in a Channel',
  props: {
    content: Property.LongText({
      displayName: 'Message',
      description: 'The message you want to send',
      required: true,
    }),
    channel: discordCommon.channel,
  },
```

Response only with my completed `connector_template`
