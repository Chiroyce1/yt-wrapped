import type {
	Channel,
	Days,
	TopChannels,
	TopVideos,
	Video,
	YouTubeVideo,
} from "./utils";

export const defaultYear = 2024;
export const defaultTop = 5;

/*
example of a video object

{
  "header": "YouTube",
  "title": "Watched Welcome! Let\u0027s work together.",
  "titleUrl": "https://www.youtube.com/watch?v\u003dsSRVihBV11o",
  "subtitles": [{
    "name": "Amin Bagheri",
    "url": "https://www.youtube.com/channel/UC4-fpdNmjvZIFjgcwGPaqnA"
  }],
  "time": "2024-11-21T14:52:38.445Z",
  "products": ["YouTube"],
  "activityControls": ["YouTube watch history"]
}

*/

function processTopChannels(videos: Video[]): TopChannels {
	console.log("[yt-wrap] processing top channels", {
		inputVideos: videos.length,
	});
	const topChannels: TopChannels = {};
	for (const video of videos) {
		const { channel } = video;
		if (topChannels[channel.name]) {
			topChannels[channel.name].videos += 1;
		} else {
			topChannels[channel.name] = { ...channel, videos: 1 };
		}
	}

	return topChannels;
}

function processTopVideos(videos: Video[]): TopVideos {
	const topVideos: TopVideos = {};
	for (const video of videos) {
		const key = `${video.title}|${video.channel.name}`;
		if (topVideos[key]) {
			topVideos[key].watched += 1;
		} else {
			topVideos[key] = { channel: video.channel, watched: 1, video };
		}
	}
	// log the top 10 keys by watched count
	const sorted = Object.values(topVideos).sort((a, b) => b.watched - a.watched);
	console.log("[yt-wrap] top 10 videos by watch count", {
		top10: sorted.slice(0, 10).map((item) => ({
			title: item.video.title,
			channel: item.channel.name,
			watched: item.watched,
		})),
	});
	return topVideos;
}

function sortByVideos(channels: TopChannels): Channel[] {
	return Object.values(channels).sort((a, b) => b.videos - a.videos);
}

function sortByWatched(
	videos: TopVideos
): { channel: Channel; watched: number; video: Video }[] {
	return Object.values(videos).sort((a, b) => b.watched - a.watched);
}

function getUniqueChannels(videos: Video[]): string[] {
	return Array.from(new Set(videos.map((video) => video.channel.name)));
}

export function getStats(videos: Video[]) {
	console.log("[yt-wrap] calculating statistics", {
		videoCount: videos.length,
	});
	const avgPerDay = videos.length / 365;
	const avgPerMonth = videos.length / 12;
	const days: Days = {};
	for (const video of videos) {
		const day = video.time.split("T")[0];
		if (days[day]) {
			days[day].push(video);
		} else {
			days[day] = [video];
		}
	}
	const daysArray = Object.values(days);
	const max = Math.max(...daysArray.map((day) => day.length));
	const result = {
		avgPerDay,
		avgPerMonth,
		days,
		max,
	};
	console.log("[yt-wrap] statistics ready", {
		avgPerDay: Number(avgPerDay.toFixed(2)),
		avgPerMonth: Number(avgPerMonth.toFixed(2)),
		totalTrackedDays: Object.keys(days).length,
		maxVideosInDay: max,
	});
	return result;
}

export function parseData(videos: YouTubeVideo[], year: number = defaultYear) {
	console.log("[yt-wrap] parse pipeline start", {
		totalItems: videos.length,
		year,
	});
	const yearStart = new Date(year, 0, 1);
	const yearEnd = new Date(year, 11, 31);

	// filter out videos that are not from the current year
	let yearVideos = videos.filter((video) => {
		const time = new Date(video.time);
		return time >= yearStart && time <= yearEnd;
	});
	console.log("[yt-wrap] filtered by year", {
		totalWithinYear: yearVideos.length,
		skippedOutsideYear: videos.length - yearVideos.length,
	});

	yearVideos = yearVideos.filter(
		(video) => video.title !== "Answered survey question"
	);
	console.log("[yt-wrap] removed survey responses", {
		afterRemoval: yearVideos.length,
	});

	yearVideos = yearVideos.filter((video) => !video.title.startsWith("Viewed "));
	console.log("[yt-wrap] removed viewed posts before mapping", {
		afterRemoval: yearVideos.length,
	});

	console.log("[yt-wrap] constructing history entries", {
		sourceItems: yearVideos.length,
	});

	let history: Video[] = yearVideos.map((video) => {
		const { titleUrl, subtitles, time } = video;
		const title = video.title.split(" ").slice(1).join(" ");
		const channel: Channel = {
			name: subtitles ? subtitles[0].name : "?",
			url: subtitles ? subtitles[0].url : "?",
			icon: undefined,
			videos: 0,
		};

		return { title, url: titleUrl, channel, time };
	});
	console.log("[yt-wrap] initial history built", {
		totalEntries: history.length,
	});

	// remove all history items that have channel `?`
	const beforeUnknownChannel = history.length;
	history = history.filter((video) => video.channel.name !== "?");
	console.log("[yt-wrap] removed entries without channel", {
		removed: beforeUnknownChannel - history.length,
		remaining: history.length,
	});

	// remove all history items that have title starting with `Viewed `
	const beforeViewedFilter = history.length;
	history = history.filter((video) => !video.title.startsWith("Viewed "));
	console.log("[yt-wrap] removed viewed-post prefixes", {
		removed: beforeViewedFilter - history.length,
		remaining: history.length,
	});

	// remove all history items with title exactly `a post`
	const beforeExactPostRemoval = history.length;
	history = history.filter((video) => !video.title.includes("a post"));
	console.log("[yt-wrap] removed literal post entries", {
		removed: beforeExactPostRemoval - history.length,
		remaining: history.length,
	});

	console.log("[yt-wrap] history cleaned", {
		totalHistory: history.length,
	});

	let songs = history.filter((video) => {
		if (!video.url) {
			return false;
		}
		return video.url.includes("music.youtube.com");
	});
	console.log("[yt-wrap] isolated music entries", {
		totalSongs: songs.length,
	});

	const uniqueSongs = Array.from(new Set(songs.map((song) => song.title)));
	console.log("[yt-wrap] deduped songs", {
		uniqueSongCount: uniqueSongs.length,
	});

	const ytVideos = history.filter((video) => {
		if (!video.url) {
			return true;
		}
		return !video.url.includes("music.youtube.com");
	});
	console.log("[yt-wrap] isolated regular youtube videos", {
		totalVideos: ytVideos.length,
	});

	const topChannels = sortByVideos(processTopChannels(ytVideos));
	const topVideos = sortByWatched(processTopVideos(ytVideos));
	const topSongs = sortByWatched(processTopVideos(songs));
	const topArtists = sortByVideos(processTopChannels(songs));

	const uniqueArtists = getUniqueChannels(songs);
	const uniqueChannels = getUniqueChannels(ytVideos);
	console.log("[yt-wrap] computed unique counts", {
		uniqueChannels: uniqueChannels.length,
		uniqueArtists: uniqueArtists.length,
	});

	const result = {
		videos: ytVideos,
		songs,

		topChannels,
		topArtists,
		topVideos,
		topSongs,

		uniqueArtists,
		uniqueChannels,
		uniqueSongs,
	};
	console.log("[yt-wrap] parse pipeline complete", {
		videos: ytVideos.length,
		songs: songs.length,
		uniqueChannels: uniqueChannels.length,
		uniqueArtists: uniqueArtists.length,
		topChannels: topChannels.length,
		topVideos: topVideos.length,
		topSongs: topSongs.length,
		topArtists: topArtists.length,
	});
	return result;
}
