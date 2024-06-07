include .env
export

generate-metadata-dev:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/metadata/insert-real-metadata.ts libs/connectors/framework

generate-metadata-prod:
	NODE_ENV=production npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/metadata/insert-real-metadata.ts libs/connectors/framework

delete-flow:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/flows/delete-flows.ts

publish-connectors-dev:
	npx ts-node -T tools/scripts/package-manager/publish-connector-to-registry.ts

publish-shared-dev:
	npx ts-node -T tools/scripts/package-manager/publish-nx-project.ts libs/shared

publish-connectors-prod:
	NODE_ENV=production npx ts-node -T tools/scripts/package-manager/publish-connector-to-registry.ts

publish-shared-prod:
	NODE_ENV=production npx ts-node -T tools/scripts/package-manager/publish-nx-project.ts libs/shared

publish-package:
	NODE_ENV=production npx ts-node -T tools/scripts/package-manager/publish-nx-project.ts libs/connectors/telegram-bot
# publish-package:
# 	NODE_ENV=production npx ts-node -T tools/scripts/package-manager/publish-nx-project.ts libs/connectors/common

ssh:
	ssh root@64.226.97.74
