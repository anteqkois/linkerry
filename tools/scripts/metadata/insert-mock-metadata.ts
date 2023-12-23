import { ConnectorMetadata } from 'libs/connectors/framework/src';
import { insertMetadata } from './insert-metadata';

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere molestias tempore debitis in reprehenderit. Sunt, reiciendis. Ullam nisi eos quo molestias, dicta et dolorum velit rem hic debitis natus cumque. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, quia porro. Illum laboriosam iusto vel omnis corrupti quis dolorum repellat dicta provident inventore tempora sint rem facilis dolores, eos fugiat.'

const connectorsMetadata: (Omit<ConnectorMetadata, 'triggers' | 'acrtions'> & { triggers: any; actions: any })[] = [
  {
    displayName: 'Trading View test',
    name: '@market-connector/trading-view',
    description: lorem,
    tags: ['alerts', 'chart', 'cryptocurrency', 'exchange', 'stock market', 'trading', 'data feed'],
    logoUrl:
      'https://lh3.googleusercontent.com/fife/AGXqzDmn9JDrH_N8jfYHZgY2LPlxUybHK5r0zLcmxF6rgFwEz0U2wRy5Ky7jMJYKwzCwrzej5PQA-t8OQc4h51NLFaO2AUzuuFE4l50mWI0bhpPyupGbo7JO_UJNFJoGmA7HNQ5x8gomJfWwRgoygi2J5w9HLOtEbH-8RqnxtRAPBphqM6cok-oaMq4LucyqI6tIAu3vSgBTQpl_8NUOYf4ToFcaK5v5AL_8M4sEJE9bOybpJuRuUaNnYTPFRBnJPgsJcZVXqrdgvbqk8DW6NhdEM0xpdek_hVkS-6w30HKUTAJ1W6N_4BykmzVhOH8g_vrmvOFelQyfy6Gi5aOurWkcWpR7kIPBuokisTNm69BX31X0kS9rxob49ZZUxsMaidzo5VYKp-JV1BFRCDwh1t4O5adzJJE3wJIFcoP9w-PDOE2nUpgx2epTt2oENMD5iF0rX8nvBXNTza6aEf5FxPKjn9_vjMj3BJAagIz_5JkCFpcQrulwvbAmo5JRkr2EjNRxeKG5KeKvHyx1IDoZuQc3P_hvrF1rHpKffspSeNjQ1keqiezipn2x_WXq4RAN146bx7pUaSUnayeliAQFRYShoFa-z4D8Hf-mvimHi540GDUe814b6oGwxV4BJIv9ypjWHXDUY2EgD3hWUfGbnvoSDqwE9yqQoXLDqXQoBHvu89dlaoD7aPPFGTzYIK3fGBPsLPS0PeQ0FfkauOt04KnM0dfI9HPsKP61W2wftTsk7VrXAR8uoWNvBK8GyGZxEAmfgak8mNUGfifj_2ITWMDDkzPBbZ6S5eV3K2nlvVvTZyKSt1VE_52aS4VfBCiAmw4bowuWT2Q3UMzItTmDZIfYpbJXiwjShlGiyhKC_j3-dI65fcuP9I4J_NYZuDOM3L6yfIiZ77Gm_r9XAXfCOa19jSDfKQ-4-znjU2nAwJInucTWI4p8Fgxy4oCm-8HuC_PkYu4gQrg1tLXsS0TQFwlnl-KUfcZ78BMURR75U_PpMYPj4xDRBfmgN4E_VgITX7etSwoXeeJVTmPZ66dFf3oX1v2NK3W8OvxWdoRVtsDH2QJfSFe8MDBy-Lqtg9gLqApZl9knnr6rWTlSGKrqovsBbed-S5M93jAiMlDbthTiWBhqc9pxZLWWKfrAZ1UT2G6iSPWSy50dJRVBSzYOLWp3qJhF9mLfqXUJhDs4b2OWDhF67PbTZhIWC_LA0QwcG-dr-VmAUOemOIXybeEqGtUn_TUx7zZwEtOMeJMg1KUPwY2mTOOlB4cJD43VPXLELnRqZhr8lbInuZGDCWEKBOvdwtSC0NsfjVOiSVUtGWnG00Ja0q1gKjVG6D_qTD6BOGtffIP3MgQuuYpjqOxL9Sodjwamfe1KLMUQSrf_HrO8p-_PuQRBAuypHWKSAkmNGldSeGq3Gx4wgc9-mtevT1LVaJchylz84GWGOVSUDWI0MDNpqi-fzLa-kcsqAeC8GSZnAcwWSwj9vVAtfGKmZZEnFieIH9qVANe0dFC8RCa5xMdj7hP3ZsLEIlJqQ_iOGXUqm56tV8GWuICwpZGuiCM3lsfUeRoo93p3mGbBZJGs94ckrB_i-3XFyx6YK_hBy9dpCX6OVDo0qURBY9kNfgOS18Eabq45PZ-tamZycWMsC6DB4D49jQ2RPQ-WdB1P1rVdNDAD6YQX=w2178-h1602',
    actions: {},
    triggers: {
      fetch_top_hundred: {
        name: 'fetch_top_hundred',
        displayName: 'Fetch top 100 coins',
        description: 'Fetch top 100 coins data',
        props: {
          interval: {
            displayName: 'Interval',
            name: 'minutes_interval',
            required: true,
            description: 'Every x minutes fetch data (min: 5, max: 60)',
            validators: [],
            type: 'Number',
          },
        },
        type: 'POLLING',
        handshakeConfiguration: {
          strategy: 'NONE',
        },
        requireAuth: false,
        sampleData: {},
      },
      fetch_one: {
        name: 'fetch_one',
        displayName: 'Fetch top 100 coins',
        description: 'Fetch top 100 coins data',
        props: {
          interval: {
            displayName: 'Interval',
            name: 'minutes_interval',
            required: true,
            description: 'Every x minutes fetch data (min: 5, max: 60)',
            validators: [],
            type: 'Number',
          },
        },
        type: 'POLLING',
        handshakeConfiguration: {
          strategy: 'NONE',
        },
        requireAuth: false,
        sampleData: {},
      },
    },
    auth: null,
    minimumSupportedRelease: '0.0.0',
    maximumSupportedRelease: '9999.9999.9999',
    version: '0.5.1',
  },
  {
    displayName: 'Maxdata test',
    name: '@market-connector/maxdata',
    description: lorem,
    tags: ['alerts', 'chart', 'cryptocurrency', 'trading', 'data feed'],
    logoUrl:
      'https://lh3.googleusercontent.com/fife/AGXqzDl6dhp2q6FJE70h80EplUv605tcBWesFgTkhrB444bs-JQb5AW4TBRxXCynwRjpU9uHRtR9VvBmrKbay2NF-P6T3pSh2L5gae9_SJhvvMjTi-ZQ7sH7ok6W8yhNrJ2ZVAFuIDE-LGMV28MeC-M8qd9p9e_1jtBJZiWqPtGsdeD3QOTW5YK7Bk8m2LPn1k7tNIJqj1syeNpFeyyeI2BvXqrJTHGFLt5TzZly-1LeBiUv-LhMALNnIWTDFus6htqtZscNSmQEA66GJFDLG21h4jZu8oqk0UDVbMss8CpB76VedcQZEzFcHFDp_JMj7juiAVCLpVS2NxCzCi4znWwUvOOpyz70XhMJQ5u_L__OImJOlWKCdZEDE_H-7Z0cI13j_qVISepE1Layf56kFuKyKGtK1lkUTPTNHcgTBY939alTY6BrEofn6CH0DN0Y6t_HvesZLELtvQbgFsnSKJjoZsaCBPzeRlLWObwqZ-Jbi5qBU016uHd4y573W8XbJ1DqKY3b8kffg9We-YM8YvccGcaH99_Hasnm_N-T_MLgIOr5WkyT7XKE18k5gXAcy-Fxpn36bShhEM5UFjmznf-MPktCwglzsmzPDFmBYfJZZClC5xcf4D_ycuDHUsbqaVtvKPKuQIXUWpDpnkm4VAdCzoBJMLU_Mq_3dXCxwhQHK851edwvSdYH_rMuEMmXq0vcD4_SJrDH6vQ7IaNOFE7w7l816p-gK2j0YaPdObbu_NemDNo6yv98pVvlNkDds34rfqM-wHYQd-fwsGugC8SFVuSfWgN_6IOzhnCGrA8SoPOKvUciOl7Gv2pSdxcdtbgP5zfUiA3bbKz7em_fyYQ3ZqGNpcZgg_xwVQlHrUhAJ-9WyYGrbJ7tpu27D363JAI0Y6Pk838qAOlX2y9JnKs1YC_p0Gl6ALFoY1b-A6TxmyAObkI0lSYHP5DcODff60z2Yk0fpYTD6PAw2Ep8NCXq80PwZYOaZVxmFTlPpq31G_50OhBk2GgiVxBGF0-iGMSDC47ZYn_Y-EQv1QmYSdijeq_GZ_JVHX19yWw6seTkiZHy4tClAIrNT_PXIhQ2vVl-z9kttjxZIEWiWbSebV1MfGE8wTE3iRacY4gPojNkkKhNpEK7tJaxgqohORqtSExJeCeRfe-M2QsCcCubHPUB93_nyL1_Vh0zc343nR-Gh4uLpk6V0zUPbUHpMaKO0ckFFuhr1A9Y45r0EeDa35SOI31OWFsWhzvVk8eh94tT2MewrZi0pvXGXVsPdfkTC9sNkKbUk3wO7BldHILf5Z-D9J44JSkI3bOiYGfX9f56Kr5KBLAf5Ph2aE9EhgIgEhf5-K036sR1BB7OvpD64xB57aebk28-uZw2QNU9_WpF3WqDO2Bu1LfHcpA8ptylzOx3TSWVoklOwIuoAhZfQs0hO9R-m4CRsYx3vHObWVB26rzT5fE9ahnTE6CG7ntITzsgfi0PAe3iW8wfaJNw66Pky24D0voA95TnmWUYoT5sjlvncZ7ciaGdk6X4V7OpKgou3bjQs90vkYciU_87gW4pmL3J559jCAZuTJmNoyZ0DYGlJF_RPvaOo8Kd8XgWZDrPGsgNLHRroIaGgtznDqLPyrSU5cVgTL-IWIcTkrppxSbgsRMqhUIlXPsy4icdqwpYH9YVoScv=w2120-h1602',
    actions: {},
    triggers: {
      fetch_top_hundred: {
        name: 'fetch_top_hundred',
        displayName: 'Fetch top 100 coins',
        description: 'Fetch top 100 coins data',
        props: {
          interval: {
            displayName: 'Interval',
            name: 'minutes_interval',
            required: true,
            description: 'Every x minutes fetch data (min: 5, max: 60)',
            validators: [],
            type: 'Number',
          },
        },
        type: 'POLLING',
        handshakeConfiguration: {
          strategy: 'NONE',
        },
        requireAuth: false,
        sampleData: {},
      },
    },
    auth: null,
    minimumSupportedRelease: '0.0.0',
    maximumSupportedRelease: '9999.9999.9999',
    version: '2.5.1',
  },
]

const main = async () => {
  await insertMetadata(connectorsMetadata)
  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
