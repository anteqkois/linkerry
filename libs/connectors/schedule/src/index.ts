import { ConnectorAuth, createConnector } from '@market-connector/connectors-framework'
import { cronExpressionTrigger } from './lib/triggers/cron-expression.trigger'
import { everyHourTrigger } from './lib/triggers/every-hour.trigger'

export const schedule = createConnector({
  name: '@linkerry/linkerry-schedule',
  displayName: 'Schedule',
  logoUrl:
    'https://lh3.googleusercontent.com/fife/AGXqzDmFAJ1NPe6NKtERr9AldF17-Q7JE2b9iAUoZATH5a3WLn3ODlsMWMfq9EALXa__jeMXBboFux_-ZSQf0g1Iu017aAUgg7JvjnA_QDi_OZ3D1sfH6Sl2bbJ_C2AM2K9QmhkAbHcBi5SX-23Zz4jd7wUKmFM4LDjX_0T-PjUFG4bQkkznP0nmbyuQR7SrNJf-qm7aISfWcihq3v6dTEet4JMEyAIbJrZwWhBy2_zH_FJ_3zShrOkC9VvV0Imh8WDHvnVuwkcvEkjyWJZcpwJ5Gmr15JMgRZ-3CSzT1fZ1YWx4giwS2kT7fMrz7irgMZVws7ApG5hMp_R1tU5sSn3Gg0mINTsbMgE6St6o8jgxhRFbf3zBUrr_MYgcoiscBNnkenmiBqw0-aDjK-Jrosu1gXjrLB8H5n6QycUnprV7dYV9j_wx6d7yk0vs-vf-2IZApMQ6bs8ZguEU8cAUlqmGZt-sRwvx2Twb4lrtshdaoYIxwarjpPA6Gd4UUogVBVsYD7_5Sd_j9mgBpiO3-p8f9E9FfBATrmwtWuFXcWB-TtRoOxQ_mSaQUV7fu0tqWtMXdzqQ_Qgxu1ruHc1YpUl7FHeh8q5zWwQuZ5sQLjVCHN-rVKm2D34KBZ6HfO1qQgiSObRnko2iq79csWIKRFKWV_ovnN-puOrngQOs9chRyF6UQADsva1VJ4FMMnGiCu5STONkwyHBO4Vz9MIm_YYCVuPDns7QCGc985Q2Ho0IN7fDuqaznDEyXL0XB6UHcp1ly8mWV_kcqLPhGfZxY609iXCXTucFTeEsh-JvSICvk7TVZHtFNKrkWbJCKpK3ex0HKDJoHxby3V5wdlqjT5k70FhJxoQUTDVFjMZtmJDc8yI-wk2ExyKpguouTKhs9Nf30WS9uIIZOSHLFrrWg1p7AwU8wzzuWoMG8-bjmo0_5IRVVVRtJdGzS2pkS_geQQLzpcPcDu2Mmv1z0mwjZpDZuJUMdHdKKlWHGVglHSpnJE2u6sRiT1iQSWRSCU_F4dciUkVytqKyio6_IoPr02jeLoedBVNhOEJgl5tcTffLS25LBYWcT8ubfuLVkfdB_j4rsKtBPCnt8CKammysq81yCMydGfDViqFabKlG9kiwN3GeXvn-A3JSKdK_vDw0Rv8eeRb-jYbQaKDWY-i0sh75_qmp66LKeKP3lOI2Pen0CXphjDzixb8ol8GnkGFNVnJ5rm7WISZOAO081yn3QE7WztIvKxhfgYL8vo0_N7yp1TjOb_MET0er_73WC7FYViwSFKYytcr2_1_QmW6IjpZN-DrhkDBbFv86_M2iJO2ORysoVOYydfFTJSuoh1P_RsYTMIrPJi49OuCxrH2yw40WeAT-x20WsIk9OIalzhOJQkrmR_5ov8Ue_i2JtyeCaKGpj2-jYmUKbMOotHJaFEE_OG-2hXsibJzM2j__QwAszWd16hLk-uj5IWx0RBUq-3VIU_8IzDSJGFaGc_VbRu053qrPuZ4zd0k5iHg58idPCNGwsV3GoIc7gg8Smqu6M4jqBVkn5AbiI1yBzM1pIILIVUNXfMZaLq7RsSoeo4xuqDbEDUHIoHdzNFrJhSZzNq3nL1_QMlxXnb0uqnUvBs66RtuoTZCAJZqVpeQsjB1zkA97kbE6abr5xzzpzE9gmyr3p2y2ssOJ=w2068-h1602',
  triggers: [everyHourTrigger, cronExpressionTrigger],
  description: 'Use to schedule starting flow every X times',
  minimumSupportedRelease: '0.0.0',
  actions: [],
  auth: ConnectorAuth.None(),
  tags: ['core', 'connector', 'plan'],
})
