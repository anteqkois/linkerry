include .env
export

update-metadata:
  npx ts-node -r tsconfig-paths/register -P libs/engine/tsconfig.lib.json tools/scripts/generate-metadata.ts libs/connectors/framework