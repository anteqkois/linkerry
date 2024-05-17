import { Icons } from '@linkerry/ui-components/server'
import { LandingConfig } from '../../types'

export const landingConfig: LandingConfig = {
  mainNav: [
    {
      title: 'Products',
      disabled: false,
      children: [
        {
          title: 'No-Code Automation Editor',
          titleIcon: <Icons.Editor className="w-9 h-9 text-primary" />,
          description: 'Create fast automations with an easy-to-use editor, AI assistance, and helpful tutorials.',
          href: '/editor',
        },
        {
          title: 'App Connectors',
          titleIcon: <Icons.Connectors className="w-9 h-9 text-green-400" />,
          description: 'Connect multiple applications into one flow to automate tasks for your business or personal life.',
          href: '/#connectors',
        },
        {
          title: 'We Automate Your Business for You',
          titleIcon: <Icons.Partnership className="w-9 h-9 text-orange-400" />,
          description: "If you don't have time to automate yourself, We can build flows for you and save your time.",
          href: 'mailto:anteqkois@gmail.com',
        },
        {
          title: 'Concept and Road Map',
          titleIcon: <Icons.RoadMap className="w-9 h-9 text-yellow-400" />,
          description: 'Check out the planning and upcoming features on Linkerry.',
          href: '/road-map',
        },
        {
          title: 'Feature Request',
          titleIcon: <Icons.Feature className="w-9 h-9 text-blue-400" />,
          description: "Need a new feature, have an idea to improve Linkerry, want to use new apps? Let's talk together.",
          href: 'mailto:anteqkois@gmail.com',
        },
      ],
    },
    {
      title: 'Supported Apps',
      disabled: false,
      children: [
        {
          title: 'AI - Artificial intelligence',
          titleIcon: <Icons.AI className="w-9 h-9 text-primary" />,
          description: 'Use popular AI apps like ChatGPT from OpenAI and process data using it.',
          href: '/connectors?tag=ai',
        },
        {
          title: 'Investment & Trading',
          titleIcon: <Icons.Invest className="w-9 h-9 text-red-400" />,
          description: 'Automate investing and trading across exchanges with tools like TradingView and Maxdata.app.',
          href: '/connectors?tag=trading&tag=investment&tag=cryptocurrency&tag=stock%20market',
        },
        {
          title: 'Daily tools',
          titleIcon: <Icons.DisplayCheck className="w-9 h-9 text-green-400" />,
          description: 'Connect popular tools like Google Cheets, Gmail, Discord, and more.',
          href: '/connectors?tag=core&tag=office&tag=collaboration&tag=communication&tag=data%20management',
        },
        {
          title: 'All Apss',
          titleIcon: <Icons.List className="w-9 h-9 text-blue-400" />,
          description: 'tag throught all supported apps.',
          href: '/connectors',
        },
      ],
    },
    // {
    //   title: 'Examples',
    //   disabled: true,
    //   children: [],
    //   // href: "/templates",
    // },
    {
      title: 'Pricing',
      disabled: false,
      children: [],
      href: '/#pricing',
    },
    // {
    //   title: 'Discord',
    //   disabled: false,
    //   children: [],
    //   href: 'https://discord.gg/Yzs9zbUjd8',
    // },
  ],
}
