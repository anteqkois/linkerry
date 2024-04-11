import { DatabaseTimestamp, Id } from "../../../common";

export interface TasksUsage extends DatabaseTimestamp{
	projectId: Id
	tasks: number
}
