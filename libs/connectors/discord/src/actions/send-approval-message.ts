// TODO update Pause logic

// import { HttpRequest, HttpMethod, httpClient } from '@linkerry/connectors-common'
// import { createAction, Property } from '@linkerry/connectors-framework'
// import { ExecutionType, PauseType } from '@linkerry/shared'
// import { discordAuth } from '..'
// import { discordCommon } from '../common'

// export const discordSendApprovalMessage = createAction({
//   auth: discordAuth,
//   name: 'request_approval_message',
//   description: 'Send a message asking for approval and await a response',
//   descriptionLong:
//     'Post a message in a specified Discord channel requesting approval from members. Ideal for getting consensus or decision-making within your guild.',
//   displayName: 'Request Approval in a Channel',
//   props: {
//     content: Property.LongText({
//       displayName: 'Message',
//       description: 'The content of the approval request message you want to send',
//       required: true,
//     }),
//     channel: discordCommon.channel,
//   },
//   async run(ctx) {
//     if (ctx.executionType === ExecutionType.BEGIN) {
//       ctx.run.pause({
//         pauseMetadata: {
//           type: PauseType.WEBHOOK,
//           response: {},
//         },
//       })

//       const approvalLink = ctx.generateResumeUrl({
//         queryParams: { action: 'approve' },
//       })
//       const disapprovalLink = ctx.generateResumeUrl({
//         queryParams: { action: 'disapprove' },
//       })

//       const request: HttpRequest<any> = {
//         method: HttpMethod.POST,
//         url: `https://discord.com/api/v9/channels/${ctx.propsValue.channel}/messages`,
//         body: {
//           content: ctx.propsValue.content,
//           components: [
//             {
//               type: 1,
//               components: [
//                 {
//                   type: 2,
//                   label: 'Approve',
//                   style: 5,
//                   url: approvalLink,
//                 },
//                 {
//                   type: 2,
//                   label: 'Disapprove',
//                   style: 5,
//                   url: disapprovalLink,
//                 },
//               ],
//             },
//           ],
//         },
//         headers: {
//           authorization: `Bot ${ctx.auth}`,
//           'Content-Type': 'application/json',
//         },
//       }

//       await httpClient.sendRequest<never>(request)
//       return {}
//     } else {
//       return {
//         approved: ctx.resumePayload.queryParams['action'] === 'approve',
//       }
//     }
//   },
// })
