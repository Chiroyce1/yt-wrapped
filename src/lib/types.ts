// least messy TypeScript types

export type Subtitle = {
	name: string;
	url: string;
};

export type Stats = {
	mostWatchedMonth: string;
	mostWatchedMonthValue: number;
	mostWatchedDay: string;
	mostWatchedDayValue: number;
	dates: Array<string>;
	videosOverYear: Array<number>;
	videosPerDay: Array<number>;
};


export type MonthData = {
	[month: string]: number;
};


export type TopChannels = {
	[channelName: string]: {
		videosWatched: number;
		channelURL: string | undefined;
	};
};

export type Days = {
	[day: string]: Array<Video>;
};

export type YouTubeVideo = {
	header: string;
	title: string;
	titleUrl: string;
	subtitles?: Array<Subtitle> | null;
	time: string;
	products?: Array<string>;
	activityControls?: Array<string>;
};

export type Video = {
	title: string;
	video: string;
	channel: string;
	time: string;
	channelURL?: string;
};
