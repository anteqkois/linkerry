import { Icons } from '@linkerry/ui-components/server'

export type NavItemChildren = {
  title: string
  titleIcon: JSX.Element
  description: string
  href: string
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = Omit<NavItem, 'href'> & {
  href?: string
  children: NavItemChildren[]
}

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      // items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type LandingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export enum LocalStorageKeys {
  StrategyCache = 'strategy-cache',
}
