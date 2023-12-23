include .env
export

update-metadata:
  npx ts-node -r tsconfig-paths/register -P tools/tsconfig.tools.json tools/scripts/metadata/insert-real-metadata.ts
  # node -r tsconfig-paths/register -r ts-node/register -P libs/engine/tsconfig.lib.json tools/scripts/generate-metadata.ts libs/connectors/framework
