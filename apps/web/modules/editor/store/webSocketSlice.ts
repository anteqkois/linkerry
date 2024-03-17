import { assertNotNullOrUndefined } from '@linkerry/shared'
import io from 'socket.io-client'
import { API_URL } from '../../../libs/api-client'
import { CreateSlice, WebSocketSlice } from './types'

export const createWebSocketSlice: CreateSlice<WebSocketSlice> = (set, get) => ({
	socket: null,
	initWebSocketConnection: () => {
		assertNotNullOrUndefined(API_URL, 'API_URL')

		const socket = io(API_URL, {
			timeout: 2_000,
			reconnectionDelayMax: 4000,
			withCredentials: true,
			autoConnect: true,
		})

		socket.on('connect', () => {
			console.log('Connected to server')
		})

		socket.on('connect_error', (err: any) => {
			console.log('connect_error', err)
		})
		socket.on('connect_failed', (err) => (err: any) => {
			console.log('connect_failed', err)
		})
		socket.on('disconnect', (err) => (err: any) => {
			console.log('disconnect', err)
		})

		// socket.onAny((eventName, ...args) => {
		// 	console.log('UNKNOWN EVENT', eventName, ...args)
		// })

		set({ socket })
		return socket
	},
	closeWebSocketConnection: async () => {
		const { socket } = get()
		socket?.disconnect()
	},
})
