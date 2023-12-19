import { readdir } from 'fs/promises'
import { readPackageJson } from './utils/files'

const getAvailableConnectorNames = async (): Promise<string[]> => {
  const ignoredPackages = ['framework', 'apps', 'dist', 'common']
  const packageNames = await readdir('libs/connectors')
  return packageNames.filter((p) => !ignoredPackages.includes(p))
}

const main = async () => {
  const names = await getAvailableConnectorNames()

  for (const packageName of names) {
    const packagePath = `libs/connectors/${packageName}`

    const packageJson = await readPackageJson(packagePath)

    const module = await import(`${packagePath}/src/index.ts`)
    const { name: pieceName, version: pieceVersion } = packageJson
    console.log(module)
  }
  console.log(names)
}

main()
  .then()
  .catch((err) => console.log(err))
