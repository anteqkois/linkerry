import { Flow, FlowVersion } from 'libs/shared/src'
import { createInterface } from 'node:readline/promises'
import { getDb } from '../../db/database'

const deleteFlowsArtifacts = async () => {
	console.log('Start deleting flow artifacts')
	const db = await getDb()

	const flowModel = db.connection.db.collection<Flow>('flows')
	const fResult = await flowModel.deleteMany({})
	console.log(`Delete ${fResult.deletedCount} flows`)

	const flowVersionModel = db.connection.db.collection<FlowVersion>('flow_versions')
	const fvResult = await flowVersionModel.deleteMany({})
	console.log(`Delete ${fvResult.deletedCount} flow-versions`)
}

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
})

const main = async () => {
	const answear = await rl.question('Do you want to continue... [y] ?')

	if (answear === 'y') {
		await deleteFlowsArtifacts()
	}

	console.log('\nEnd process')
	rl.close()
	return process.exit(0)
}

main().catch((err) => console.log(err))
