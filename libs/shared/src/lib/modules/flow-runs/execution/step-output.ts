import { ActionType, TriggerType } from "../../flows"

export enum StepOutputStatus {
    FAILED = 'FAILED',
    PAUSED = 'PAUSED',
    RUNNING = 'RUNNING',
    STOPPED = 'STOPPED',
    SUCCEEDED = 'SUCCEEDED',
}

type BaseStepOutputParams<T extends ActionType | TriggerType, OUTPUT> = {
    type: T
    status: StepOutputStatus
    input: unknown
    output?: OUTPUT
    duration?: number
    errorMessage?: unknown
}

export class GenricStepOutput<T extends ActionType | TriggerType, OUTPUT> {
    type: T
    status: StepOutputStatus
    input: unknown
    output?: OUTPUT
    duration?: number
    errorMessage?: unknown

    constructor(step: BaseStepOutputParams<T, OUTPUT>) {
        this.type = step.type
        this.status = step.status
        this.input = step.input
        this.output = step.output
        this.duration = step.duration
        this.errorMessage = step.errorMessage
    }

    setOutput(output: OUTPUT): GenricStepOutput<T, OUTPUT> {
        return new GenricStepOutput<T, OUTPUT>({
            ...this,
            output,
        })
    }

    setStatus(status: StepOutputStatus): GenricStepOutput<T, OUTPUT> {
        return new GenricStepOutput<T, OUTPUT>({
            ...this,
            status,
        })
    }

    setErrorMessage(errorMessage: unknown): GenricStepOutput<T, OUTPUT> {
        return new GenricStepOutput<T, OUTPUT>({
            ...this,
            errorMessage,
        })
    }

    setDuration(duration: number): GenricStepOutput<T, OUTPUT> {
        return new GenricStepOutput<T, OUTPUT>({
            ...this,
            duration,
        })
    }

    static create<T extends ActionType | TriggerType, OUTPUT>({ input, type, status, output }: { input: unknown, type: T, status: StepOutputStatus, output?: OUTPUT }): GenricStepOutput<T, OUTPUT> {
        return new GenricStepOutput<T, OUTPUT>({
            input,
            type,
            status,
            output,
        })
    }

}

export type StepOutput = GenricStepOutput<ActionType.LoopOnItems, LoopStepResult> | GenricStepOutput<ActionType.Branch, BranchStepResult> | GenricStepOutput<Exclude<ActionType, ActionType.LoopOnItems | ActionType.Branch> | TriggerType, unknown>

type BranchStepResult = {
    condition: boolean
}

export class BranchStepOutput extends GenricStepOutput<ActionType.Branch, BranchStepResult> {
    constructor(step: BaseStepOutputParams<ActionType.Branch, BranchStepResult>) {
        super(step)
    }

    static init({ input }: { input: unknown }): BranchStepOutput {
        return new BranchStepOutput({
            type: ActionType.Branch,
            input,
            status: StepOutputStatus.SUCCEEDED,
        })
    }

}


type LoopStepResult = {
    item: unknown
    index: number
    iterations: Record<string, StepOutput>[]
}

export class LoopStepOutput extends GenricStepOutput<ActionType.LoopOnItems, LoopStepResult> {
    constructor(step: BaseStepOutputParams<ActionType.LoopOnItems, LoopStepResult>) {
        super(step)
        this.output = step.output ?? {
            item: undefined,
            index: 0,
            iterations: [],
        }
    }

    static init({ input }: { input: unknown }): LoopStepOutput {
        return new LoopStepOutput({
            type: ActionType.LoopOnItems,
            input,
            status: StepOutputStatus.SUCCEEDED,
        })
    }

    addIteration({ item, index }: { item: unknown, index: number }): LoopStepOutput {
        return new LoopStepOutput({
            ...this,
            output: {
                item,
                index,
                iterations: [...(this.output?.iterations ?? []), {}],
            },
        })
    }

}
