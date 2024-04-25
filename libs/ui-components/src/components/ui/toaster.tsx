import { ToastProviderProps } from '@radix-ui/react-toast'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast'
import { useToast } from './use-toast'

export interface ToasterProps extends ToastProviderProps {
	viewportClassName?: string
}

export function Toaster(props: ToasterProps) {
	const { toasts } = useToast()

	return (
		<ToastProvider {...props}>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && <ToastDescription>{description}</ToastDescription>}
						</div>
						{action}
						<ToastClose />
					</Toast>
				)
			})}
			<ToastViewport className={props.viewportClassName} />
		</ToastProvider>
	)
}
