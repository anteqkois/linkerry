import { FastifyPluginAsync } from 'fastify'

export const corsHeadersPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onSend', async (request, reply, payload) => {
    const origin = process.env['FRONTEND_HOST'] || 'https://linkerry.com'

    if (!reply.hasHeader('Access-Control-Allow-Origin')) {
      reply.header('Access-Control-Allow-Origin', origin)
    }
    if (!reply.hasHeader('Access-Control-Allow-Credentials')) {
      reply.header('Access-Control-Allow-Credentials', 'true')
    }
    return payload
  })
}
