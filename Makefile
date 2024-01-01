include .env
export

metadata-real:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/metadata/insert-real-metadata.ts

metadata-mock:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/metadata/insert-mock-metadata.ts

delete-flow:
	npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/flows/delete-flows.ts
