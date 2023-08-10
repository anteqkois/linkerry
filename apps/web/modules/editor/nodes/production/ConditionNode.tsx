import {
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@market-connector/ui-components/client'
import {
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@market-connector/ui-components/server'
import { NodeProps } from 'reactflow'

type Props = NodeProps

export function ConditionNode({ data, xPos, yPos }: Props) {
  // const onClickAdd = useCallback(() => {
  //   const newId = +nodes[nodes.length - 1].id + 1;

  //   const newNode: Node = {
  //     id: newId.toString(),
  //     // we are removing the half of the node width (75) to center the new node
  //     // position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
  //     type: 'condition',
  //     position: project({ x: 0, y: yPos + 100 }),
  //     data: {
  //       _id: newId,
  //       id: newId,
  //       type: "Alert",
  //       user: "fji44miko3oj3902",
  //       name: `Test Alert ${newId}`,
  //       requiredValue: 1,
  //       operator: "Equal",
  //       triggeredTimes: newId,
  //       active: true,
  //       eventValidityUnix: 49378124,
  //       testMode: false,
  //       isMarketProvider: false,
  //       alert: {
  //         provider: "Trading View",
  //       },
  //     },
  //     deletable: false
  //   };

  //   // const newNodes = [...nodes, newNode];
  //   // console.log(newNodes);

  //   // setNodes(newNodes);
  //   setNodes(nds => [...nds, newNode]);
  // }, [project]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Add Buy Condition</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Create New</TabsTrigger>
            <TabsTrigger value="password">Add Existing</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            {/* <Card> */}
            <CardHeader className="p-2">
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter className="p-2 flex justify-end">
              <Button variant={'secondary'}>Add condition</Button>
            </CardFooter>
            {/* </Card> */}
          </TabsContent>
          <TabsContent value="password">

          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
