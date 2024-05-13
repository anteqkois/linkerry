import fastDeepEqual from 'fast-deep-equal'

const main = async () => {
  console.log(fastDeepEqual(['siema', 'to', 'ty', 1], ['siema', 'to', 'ty', 2]))
  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
