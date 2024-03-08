npx madge --image graph.png --extensions ts ./libs/nest-core/src/modules/flows/triggers/triggers.module.ts
npx madge --image graph.png --extensions ts --circular ./libs/nest-core/src/modules/flows/triggers/trigger-hooks/trigger-hooks.module.ts

npx madge --dot --extensions ts ./libs/nest-core/src/modules/flows/triggers/trigger-hooks/trigger-hooks.module.ts > graph.gv
intsal `Graphviz Interactive Preview` and open using command palet
