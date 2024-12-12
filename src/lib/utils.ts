import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type Subtitle = {
	name: string;
	url: string;
};

export type Channel = {
	name: string;
	url: string;
	icon: string | undefined;
	videos: number;
};

export type TopChannels = {
	[channelName: string]: Channel;
};

export type TopVideos = {
	[title: string]: {
		watched: number;
		channel: Channel;
		video: Video;
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
	url: string;
	time: string;
	channel: Channel;
};

export type Stats =
	| {
			videos: Video[];
			songs: Video[];
			topChannels: Channel[];
			topArtists: Channel[];
			topVideos: { channel: Channel; watched: number; video: Video }[];
			topSongs: { channel: Channel; watched: number; video: Video }[];
			uniqueArtists: string[];
			uniqueChannels: string[];
	  }
	| undefined;
