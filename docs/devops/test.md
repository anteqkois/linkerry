## One file

nx e2e api-e2e --testFile users.spec.ts

## When error with JSON serialization

nx e2e api-e2e --detectOpenHandles

nx e2e api-e2e --detectOpenHandles --testFile auth.spec.ts

## nestJS test

npx jest --detectOpenHandles libs/nest-core/src/modules
