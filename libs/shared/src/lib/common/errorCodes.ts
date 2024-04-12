
export enum ErrorCodeQuota {
	QUOTA_EXCEEDED_MINIMUM_POLLING_INTERVAL = 'QUOTA_EXCEEDED_MINIMUM_POLLING_INTERVAL',
	QUOTA_EXCEEDED_CONNECTIONS = 'QUOTA_EXCEEDED_CONNECTIONS',
	QUOTA_EXCEEDED_TASKS = 'QUOTA_EXCEEDED_TASKS',
	QUOTA_EXCEEDED_FLOW_STEPS = 'QUOTA_EXCEEDED_FLOW_STEPS',
	QUOTA_EXCEEDED_PROJECT_MEMBERS = 'QUOTA_EXCEEDED_PROJECT_MEMBERS',
	QUOTA_EXCEEDED_FLOWS = 'QUOTA_EXCEEDED_FLOWS',
	QUOTA_EXCEEDED_FILE_UPLOADS_MB = 'QUOTA_EXCEEDED_FILE_UPLOADS_MB',
	QUOTA_EXCEEDED_FLOW_RUN_INTERVAL_GAP = 'QUOTA_EXCEEDED_FLOW_RUN_INTERVAL_GAP',
	QUOTA_EXCEEDED_MAXIUMUM_ACTIVE_FLOWS = 'QUOTA_EXCEEDED_MAXIUMUM_ACTIVE_FLOWS',
	QUOTA_EXCEEDED_MAXIMUM_EXECUTION_TIME = 'QUOTA_EXCEEDED_MAXIMUM_EXECUTION_TIME',
	QUOTA_EXCEEDED_CONNECTORS = 'QUOTA_EXCEEDED_CONNECTORS',
	QUOTA_EXCEEDED_TRIGGERS_AMOUNT = 'QUOTA_EXCEEDED_TRIGGERS_AMOUNT',
}

enum ErrorCodeDefault {
	INVALID_TYPE = 'INVALID_TYPE',
	APP_CONNECTION_NOT_FOUND = 'APP_CONNECTION_NOT_FOUND',
	AUTHENTICATION = 'AUTHENTICATION',
	AUTHORIZATION = 'AUTHORIZATION',
	CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
	DOMAIN_NOT_ALLOWED = 'DOMAIN_NOT_ALLOWED',
	EMAIL_IS_NOT_VERIFIED = 'EMAIL_IS_NOT_VERIFIED',
	ENGINE_OPERATION_FAILURE = 'ENGINE_OPERATION_FAILURE',
	ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
	EXECUTION_TIMEOUT = 'EXECUTION_TIMEOUT',
	EXISTING_USER = 'EXISTING_USER',
	FILE_NOT_FOUND = 'FILE_NOT_FOUND',
	FLOW_INSTANCE_NOT_FOUND = 'INSTANCE_NOT_FOUND',
	FLOW_NOT_FOUND = 'FLOW_NOT_FOUND',
	FLOW_OPERATION_INVALID = 'FLOW_OPERATION_INVALID',
	FLOW_RUN_NOT_FOUND = 'FLOW_RUN_NOT_FOUND',
	INVALID_API_KEY = 'INVALID_API_KEY',
	INVALID_APP_CONNECTION = 'INVALID_APP_CONNECTION',
	INVALID_BEARER_TOKEN = 'INVALID_BEARER_TOKEN',
	INVALID_CLAIM = 'INVALID_CLAIM',
	INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
	INVALID_OR_EXPIRED_JWT_TOKEN = 'INVALID_OR_EXPIRED_JWT_TOKEN',
	INVITATION_ONLY_SIGN_UP = 'INVITATION_ONLY_SIGN_UP',
	JOB_REMOVAL_FAILURE = 'JOB_REMOVAL_FAILURE',
	JOB_FAILURE = 'JOB_FAILURE',
	JOB_INVALID = 'JOB_INVALID',
	// OPEN_AI_FAILED = 'OPEN_AI_FAILED',
	PAUSE_METADATA_MISSING = 'PAUSE_METADATA_MISSING',
	PERMISSION_DENIED = 'PERMISSION_DENIED',
	CONNECTOR_NOT_FOUND = 'CONNECTOR_NOT_FOUND',
	CONNECTOR_TRIGGER_NOT_FOUND = 'CONNECTOR_TRIGGER_NOT_FOUND',
	STEP_NOT_FOUND = 'STEP_NOT_FOUND',
	SYSTEM_ENV_INVALID = 'SYSTEM_PROP_INVALID',
	SYSTEM_ENV_NOT_DEFINED = 'SYSTEM_PROP_NOT_DEFINED',
	TEST_TRIGGER_FAILED = 'TEST_TRIGGER_FAILED',
	TEST_ACTION_FAILED = 'TEST_ACTION_FAILED',
	TRIGGER_DISABLE = 'TRIGGER_DISABLE',
	TRIGGER_ENABLE = 'TRIGGER_ENABLE',
	TRIGGER_FAILED = 'TRIGGER_FAILED',
	USER_IS_INACTIVE = 'USER_IS_INACTIVE',
	VALIDATION = 'VALIDATION',
	DATABASE_INTERNAL = 'DATABASE_INTERNAL',
	INTERNAL_SERVER = 'INTERNAL_SERVER',
	HTTP = 'HTTP',
	WEB_SOCKET_ERROR = 'WEB_SOCKET_ERROR',
	INVALID_BILLING = 'INVALID_BILLING',
}

/* Merge Error enums */
export const ErrorCode = { ...ErrorCodeDefault, ...ErrorCodeQuota }
export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode]
