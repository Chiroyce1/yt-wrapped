import type {
	Channel,
	Days,
	TopChannels,
	TopVideos,
	Video,
	YouTubeVideo,
} from "./utils";

export const year = 2024;

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

export function parseData(videos: YouTubeVideo[]): Video[] {
	const yearStart = new Date(year, 0, 1);
	const yearEnd = new Date(year, 11, 31);
	console.info(`Parsing ${videos.length} videos...`);

	// filter out videos that are not from the current year
	const yearVideos = videos.filter((video) => {
		const time = new Date(video.time);
		return time >= yearStart && time <= yearEnd;
	});

	console.info(`${yearVideos.length} videos in ${year}`);

	const history: Video[] = yearVideos.map((video) => {
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

	return history;
}

export function statTopChannels(videos: Video[]) {
	const topChannels: TopChannels = {};
	for (const video of videos) {
		const { channel } = video;
		if (topChannels[channel.name]) {
			topChannels[channel.name].videos += 1;
		} else {
			topChannels[channel.name] = { ...channel, videos: 1 };
		}
	}

	// sort by number of videos watched
	const sortedChannels = Object.values(topChannels).sort(
		(a, b) => b.videos - a.videos
	);
	return sortedChannels;
}

export function statTopVideos(videos: Video[], shorts = false, music = false) {
	const topVideos: TopVideos = {};
	for (const video of videos) {
		const { title } = video;
		if (topVideos[title]) {
			topVideos[title].watched += 1;
		} else {
			topVideos[title] = { watched: 1, channel: video.channel, video };
		}
	}
	const sortedVideos = Object.values(topVideos).sort(
		(a, b) => b.watched - a.watched
	);
	return sortedVideos;
}
