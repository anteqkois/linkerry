import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { fetchMarktecap } from './lib/actions/fetch-marketcap'
import { fetchById } from './lib/triggers/fetch-by-id'
import { fetchTopHundred } from './lib/triggers/fetch-top-hundred'

export const coingecko = createConnector({
  name: '@linkerry/coingecko',
  displayName: 'Coingecko',
  logoUrl:
    'https://lh3.googleusercontent.com/fife/AGXqzDmFSJ2IUKtH36tY4ZY99CHpjVQo80BTOWxHriDPrJmGWvcaVqQP__eFKxgbkP8TJeT0eAuDooaAI0ZnpGq7vanGRF9aEMS9ehKFrdNRWx_BNG5kqlQGjNBr1DH6gk3aY46XozUsy_l8ajFWuXPhTW26KSYHceY-Y2aYGrv5q3n6ILRcsiFownw-GUzUFx4PDH1B9itHoLkdvjDMNaJh0Q6ksPfyVTymjqg4p1s8Z5EolfSoAOiepr8WEpBj32Jd-Ju4bpYkPqQ7QaP_pkTrlTGkq1uSrXuOm6ZYeD2dNzmiW_hVgh7yp0DXwqfJLsq3Ug9osj8fBevrWfzoKtkINL7Dk1NUIphGAEEGTXgn3nRSZOZPou28N3QiU_EcsbIh_R9qzxIA8NluWwQeno7gyBdbav30j-8GretuDKZkFOLWpAX62PUbK9fwbvbWk2VbN62pr4bXXHbmjBkDzFiY_rW3no-aY9ItpRanEk7f7LugrISCVa6ZXTWL4qMLkZ1GLoyVeDy1aMynV6HG_xVx2gc9pIBMtC5p6I1r1eZmwfvy10xew9DQxXwObGmj8g9hCNmqdyHTdOhJlRHSQMlPIXZ__iaPpy0nID-dNqPebSHt_VOOHo-M5cuWnkUhsQ82lWhB2FgFD5Ag-ZMN3JggwZ0RNssckwh6xbXoU-H1yHWW2t3xfr9z7Q6UgCDWRJ0IcR6noKvI8YWLOhbB4P5us6tMw1oNbFKCPN3hybavXSzFrxHNp4W7Yno6HdFFyXZVnJONJNd-RHfETTX0f_Bv7dH2fvV-tz9FnKxmiJ8XWCrNfksvbSanqiRH772vFrjC9uWKkIoG9O-yaqkelVFYHPndngVCycTuJ813HiWMljsTxU0GuoxT7mbwQFr7Y6gzjiJWIcZeMyn6oFgphDCURFAXU0CQQfwoZP0eBlHXB5yCsR1TthG_0Gx1nXWnNbWo6ofOqULyyWf_BdtTRHMxXEkbsWRqqK1ha6mifySrA0jkXNHkX1XhmzL876QXm7i9_95m2IwER9Aw-JGpV8_fxcPWz4-TsrM5a1ekgnKcr-i5kJQLtj2CgnKu0bJz3byuHn8I9AZJScl4fsus2bb_yE0lvDvze4fTPTZnq4klTYbAU8azUe8qc0mhNZ73xc5CEw9UBrPJaoK7VSvquU6vJVSQegGQZcxl2TVnEaV-1YC89XxODRo8wOTkkQPe21DghS9xMAFACVv09oJGDzEWjCL_8MJ3BMV4VlOS3O5BQiSL8Q30RhmN_tUANFbnewAPx5T7pjZ5wfvtS3DKzA2-wedmTejaRpJBxREkvZDxZ0zdpiLTAoAp5ktZmax0Tf-3N1QEkziGsnLnUIuDXphfJzaMqFD-hDPVkuDun05F70KidXVHV-AbU2hes8UqsXFeCz6oOPJw29l74LkEt30jo4F6AFDqEQIoKLDZo0mx0BGYQXzS5En3X6RrAYA1ZYdcxEYV_vhW9-x6kGtZrhQVUww5MyZExfSWajoth1vBO-b9hBWm2XA_y2AAUX5hDT-KVm_tlqhh2iwbdg198p-ijYZiasyJ2mSuJseyupRcXI7kQMrahwTT6dQRI_Cku-EOgoDbBPjLWuuYhGgZbjAvfwZj-MPfYN7PRdcKOgR_ePYctB8nd0QcKRoFRBRdLkvLQArh4Aya=w2094-h1602',
  triggers: [fetchTopHundred, fetchById],
  description: 'Coingecko connector for cryptocurrency data',
  minimumSupportedRelease: '0.0.0',
  actions: [fetchMarktecap],
  auth: ConnectorAuth.None(),
  tags: ['cryptocurrency', 'data feed'],
})
