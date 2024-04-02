export interface GetCoinResponse {
	id: string
	symbol: string
	name: string
	web_slug: string
	asset_platform_id: any
	platforms: Platforms
	detail_platforms: DetailPlatforms
	block_time_in_minutes: number
	hashing_algorithm: any
	categories: string[]
	preview_listing: boolean
	public_notice: any
	additional_notices: any[]
	localization: Localization
	description: Description
	links: Links
	image: Image
	country_origin: string
	genesis_date: any
	sentiment_votes_up_percentage: number
	sentiment_votes_down_percentage: number
	watchlist_portfolio_users: number
	market_cap_rank: number
	market_data: MarketData
	community_data: CommunityData
	developer_data: DeveloperData
	status_updates: any[]
	last_updated: string
	tickers: any[][]
}

export interface Platforms {
	'': string
}

export interface DetailPlatforms {
	'': any[]
}

export interface Localization {
	en: string
	de: string
	es: string
	fr: string
	it: string
	pl: string
	ro: string
	hu: string
	nl: string
	pt: string
	sv: string
	vi: string
	tr: string
	ru: string
	ja: string
	zh: string
	'zh-tw': string
	ko: string
	ar: string
	th: string
	id: string
	cs: string
	da: string
	el: string
	hi: string
	no: string
	sk: string
	uk: string
	he: string
	fi: string
	bg: string
	hr: string
	lt: string
	sl: string
}

export interface Description {
	en: string
	de: string
	es: string
	fr: string
	it: string
	pl: string
	ro: string
	hu: string
	nl: string
	pt: string
	sv: string
	vi: string
	tr: string
	ru: string
	ja: string
	zh: string
	'zh-tw': string
	ko: string
	ar: string
	th: string
	id: string
	cs: string
	da: string
	el: string
	hi: string
	no: string
	sk: string
	uk: string
	he: string
	fi: string
	bg: string
	hr: string
	lt: string
	sl: string
}

export interface Links {
	homepage: any[]
	whitepaper: string
	blockchain_site: any[]
	official_forum_url: any[]
	chat_url: any[]
	announcement_url: any[]
	twitter_screen_name: string
	facebook_username: string
	bitcointalk_thread_identifier: any
	telegram_channel_identifier: string
	subreddit_url: string
	repos_url: any[]
}

export interface Image {
	thumb: string
	small: string
	large: string
}

export interface MarketData {
	current_price: any[]
	total_value_locked: any
	mcap_to_tvl_ratio: any
	fdv_to_tvl_ratio: any
	roi: any
	ath: any[]
	ath_change_percentage: any[]
	ath_date: any[]
	atl: any[]
	atl_change_percentage: any[]
	atl_date: any[]
	market_cap: any[]
	market_cap_rank: number
	fully_diluted_valuation: any[]
	market_cap_fdv_ratio: number
	total_volume: any[]
	high_24h: any[]
	low_24h: any[]
	price_change_24h: number
	price_change_percentage_24h: number
	price_change_percentage_7d: number
	price_change_percentage_14d: number
	price_change_percentage_30d: number
	price_change_percentage_60d: number
	price_change_percentage_200d: number
	price_change_percentage_1y: number
	market_cap_change_24h: number
	market_cap_change_percentage_24h: number
	price_change_24h_in_currency: any[]
	price_change_percentage_1h_in_currency: any[]
	price_change_percentage_24h_in_currency: any[]
	price_change_percentage_7d_in_currency: any[]
	price_change_percentage_14d_in_currency: any[]
	price_change_percentage_30d_in_currency: any[]
	price_change_percentage_60d_in_currency: any[]
	price_change_percentage_200d_in_currency: any[]
	price_change_percentage_1y_in_currency: PriceChangePercentage1yInCurrency
	market_cap_change_24h_in_currency: any[]
	market_cap_change_percentage_24h_in_currency: any[]
	total_supply: number
	max_supply: number
	circulating_supply: number
	last_updated: string
}

export interface PriceChangePercentage1yInCurrency {}

export interface CommunityData {
	facebook_likes: any
	twitter_followers: number
	reddit_average_posts_48h: number
	reddit_average_comments_48h: number
	reddit_subscribers: number
	reddit_accounts_active_48h: number
	telegram_channel_user_count: number
}

export interface DeveloperData {
	forks: number
	stars: number
	subscribers: number
	total_issues: number
	closed_issues: number
	pull_requests_merged: number
	pull_request_contributors: number
	code_additions_deletions_4_weeks: any[]
	commit_count_4_weeks: number
	last_4_weeks_commit_activity_series: any[]
}
