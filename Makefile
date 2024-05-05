include .env
export

generate-metadata-real:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/metadata/insert-real-metadata.ts libs/connectors/framework

metadata-mock:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/metadata/insert-mock-metadata.ts

delete-flow:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/flows/delete-flows.ts

publish-connectors:
	npx ts-node -T tools/scripts/package-manager/publish-connector-to-local-registry.ts

ssh:
	ssh root@64.226.97.74
