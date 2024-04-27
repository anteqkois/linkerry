import { BaseDatabaseFields, Id } from "../../../common";

export interface TasksUsage extends BaseDatabaseFields{
	projectId: Id
	tasks: number
}
