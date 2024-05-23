import { FileSandbox } from './file-sandbox'

export enum ExecutionMode {
  // Sandboxed = 'Sandboxed',
  Unsandboxed = 'Unsandboxed',
}

const getSandbox = () => {
  const executionMode = process.env['EXECUTION_MODE'] as ExecutionMode

  if (!executionMode) throw new Error(`Can not retrive sandbox mode`)

  const sandbox = {
    // [ExecutionMode.Sandboxed]: IsolateSandbox,
    [ExecutionMode.Unsandboxed]: FileSandbox,
  }

  return sandbox[executionMode]
}

export const Sandbox = getSandbox()

export type Sandbox = InstanceType<typeof Sandbox>
