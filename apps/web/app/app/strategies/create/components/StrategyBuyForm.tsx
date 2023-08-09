'use client'

import { Form, useForm } from "react-hook-form"
import { useUser } from "../../../../../modules/user/useUser"
import { z } from "zod"

// export const StrategyBuyForm = () => {
//   const { user } = useUser()
//   const form = useForm<z.infer<typeof Schema>>({
//     resolver: zodResolver(userKeysSchema),
//     defaultValues: {
//       aKey: '',
//       exchange: exchanges[0]._id,
//       exchangeCode: exchanges[0].code,
//       name: '',
//       sKey: '',
//       user: user._id,
//     },
//   })

//   useEffect(() => {
//     setIsLoading(false)
//   }, [])

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="shadcn" {...field} />
//               </FormControl>
//               <FormDescription>This is your public display name.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   )
// }
