export class LinkerryFile {
	constructor(public filename: string, public data: Buffer, public extension?: string) {}

	get base64(): string {
			return this.data.toString('base64');
	}
}

// export type FileProperty<R extends boolean> = BasePropertySchema & TPropertyValue<LinkerryFile, PropertyType.FILE, ValidationInputType.FILE, R>;
