export const ConfigurationItem = ({ label, value }: { label: string; value: string | number }) => {
	return (
		<p className="flex justify-between hover:bg-accent hover:text-accent-foreground py-1 px-2 rounded-md">
			<span className="text-muted-foreground">{label}:</span>
			<span>{value}</span>
		</p>
	)
}
