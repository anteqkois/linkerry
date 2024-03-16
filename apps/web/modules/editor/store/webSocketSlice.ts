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

		// TODO handle errors
		socket.on('message', (data) => {
			console.log('NEW SOCKET MESSAGE')
			// set((state) => ({ messages: [...state.messages, data] }));
		})

		set({ socket })
		return socket
	},
	closeWebSocketConnection: async () => {
		const { socket } = get()
		socket?.disconnect()
	},
})
