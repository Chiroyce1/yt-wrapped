import type {
	Channel,
	Days,
	TopChannels,
	TopVideos,
	Video,
	YouTubeVideo,
} from "./utils";

export const year = 2024;
export const top = 5;

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
		const { title } = video;
		if (topVideos[title]) {
			topVideos[title].watched += 1;
		} else {
			topVideos[title] = { channel: video.channel, watched: 1, video };
		}
	}
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
	return {
		avgPerDay,
		avgPerMonth,
		days,
		max,
	};
}

export function parseData(videos: YouTubeVideo[]) {
	const yearStart = new Date(year, 0, 1);
	const yearEnd = new Date(year, 11, 31);
	console.info(`Parsing ${videos.length} videos...`);

	// filter out videos that are not from the current year
	let yearVideos = videos.filter((video) => {
		const time = new Date(video.time);
		return time >= yearStart && time <= yearEnd;
	});
	yearVideos = yearVideos.filter(
		(video) => video.title !== "Answered survey question"
	);

	console.info(`${yearVideos.length} videos in ${year}`);

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

	// remove all history items that have channel `?`
	history = history.filter((video) => video.channel.name !== "?");

	let songs = history.filter((video) => {
		if (!video.url) {
			return false;
		}
		return video.url.includes("music.youtube.com");
	});

	const uniqueSongs = Array.from(new Set(songs.map((song) => song.title)));

	const ytVideos = history.filter((video) => {
		if (!video.url) {
			return true;
		}
		return !video.url.includes("music.youtube.com");
	});

	const topChannels = sortByVideos(processTopChannels(ytVideos));
	const topVideos = sortByWatched(processTopVideos(ytVideos));
	const topSongs = sortByWatched(processTopVideos(songs));
	const topArtists = sortByVideos(processTopChannels(songs));

	const uniqueArtists = getUniqueChannels(songs);
	const uniqueChannels = getUniqueChannels(ytVideos);

	return {
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
}
