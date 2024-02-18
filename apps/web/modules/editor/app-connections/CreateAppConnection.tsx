import { DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from '@linkerry/ui-components/client'
import { Button } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'

export interface CreateAppConnectionProps extends HTMLAttributes<HTMLElement> {
	onCreateAppConnection: () => void
}

export const CreateAppConnection = ({ onCreateAppConnection }: CreateAppConnectionProps) => {
	return (
		<>
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>Make changes to your profile here. Click save when done.</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-right">
						Name
					</Label>
					<Input id="name" value="Pedro Duarte" className="col-span-3" />
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="username" className="text-right">
						Username
					</Label>
					<Input id="username" value="@peduarte" className="col-span-3" />
				</div>
			</div>
			<DialogFooter>
				<Button type="reset" variant={'outline'}>
					Cancel
				</Button>
				<Button type="submit">Save</Button>
			</DialogFooter>
		</>
	)
}
