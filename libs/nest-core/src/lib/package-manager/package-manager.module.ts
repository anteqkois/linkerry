import { Module } from '@nestjs/common'
import { PackageManagerService } from './package-manager.service'

@Module({
  providers: [PackageManagerService],
  exports: [PackageManagerService],
})
export class PackageManagerModule {}
