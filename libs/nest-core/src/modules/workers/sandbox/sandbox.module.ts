import { Module } from '@nestjs/common';
import { SandboxManagerService } from './cache/sandbox-manager.service';
import { SandboxProvisionerService } from './sandbox-provisioner.service';
import { SandboxService } from './sandbox.service';

@Module({
  providers: [SandboxService, SandboxProvisionerService, SandboxManagerService],
	exports:[ SandboxProvisionerService,]
})
export class SandboxModule {}
