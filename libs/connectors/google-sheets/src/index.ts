import { ConnectorAuth, OAuth2AuthorizationMethod, createConnector } from '@linkerry/connectors-framework'
import { getRowsAction } from './actions/get-rows'
import { newRowAdded } from './triggers/new-row-added-webhook'

export const googleSheetsAuth = ConnectorAuth.OAuth2({
	description: '',
	authUrl: 'https://accounts.google.com/o/oauth2/auth',
	tokenUrl: 'https://oauth2.googleapis.com/token',
	required: true,
	scope: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.readonly'],
	authorizationMethod: OAuth2AuthorizationMethod.BODY,
})

export const coingecko = createConnector({
	displayName: 'Google Sheets',
	logoUrl:
		'/images/connectors/google-sheets.png',
	triggers: [newRowAdded],
	description: 'Create sheets, data analysis and collaborate live',
	minimumSupportedRelease: '0.0.0',
	actions: [getRowsAction],
	auth: googleSheetsAuth,
	tags: ['office', 'collaboration', 'data management'],
})
