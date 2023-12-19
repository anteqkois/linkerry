import { Injectable } from '@nestjs/common'
import { join, resolve, sep } from 'path'

@Injectable()
export class PackageManagerService {
  constructor() {
    //
  }

  getBasePath({ connectorName }: { connectorName: string }) {
    const basePath = resolve(__dirname.split(`${sep}dist`)[0])
    const baseLinkPath = join(basePath, 'dist', 'packages', 'connectors', connectorName)
    return baseLinkPath
  }
  // /Users/anteqkois/Code/Projects/me/market-connector
  // pnpm link /Users/anteqkois/Code/Projects/me/market-connector/dist/libs/connectors/coingecko

  // linkConnector(name: string, version: string) {
  //   const baePath = this.getBasePath()
  //   return packageManager.link({
  //     linkPath: baePath,
  //     path:
  //   })
  // }

  // async linkFrameworkPackages(projectPath: string, baseLinkPath: string, frameworkPackages: Record<string, string>): Promise<void> {
    // await updatePackageJson('framework', baseLinkPath, frameworkPackages)
    // await packageManager.link({
    //     path: projectPath,
    //     linkPath: `${baseLinkPath}/framework`,
    // })
    // await updatePackageJson('common', baseLinkPath, frameworkPackages)
    // await packageManager.link({
    //     path: projectPath,
    //     linkPath: `${baseLinkPath}/common`,
    // })
  // }
}
