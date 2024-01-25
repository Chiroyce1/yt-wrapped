import type {
	TopChannels,
	YouTubeVideo,
	Days,
	Video,
	MonthData,
} from "./types";

export const year = 2023;

export function sortTopChannels(obj: TopChannels): TopChannels {
	// Ty ChatGPT
	let entries = Object.entries(obj);
	// Filter out numeric keys
	entries = entries.filter(([key]) => !/^\d+$/.test(key));
	// Sort by descending order of videosWatched
	entries.sort((a, b) => b[1].videosWatched - a[1].videosWatched);
	return Object.fromEntries(entries);
}

export function filterVideos(vids: Array<YouTubeVideo>): Array<YouTubeVideo> {
	return vids.filter((obj) => {
		if (!obj.titleUrl) return false;
		if (obj.titleUrl.includes("music.youtube.com")) return false;
		if (!(new Date(obj.time).getFullYear() === year)) return false;
		return true;
	});
}

export function processData(videos: Array<YouTubeVideo>): {
	days: Days;
	top: TopChannels;
} {
	const groupedByDate: Days = {};
	let topChannels: TopChannels = {};

	videos.forEach((vid) => {
		// Extract only the date part
		const dateKey = vid.time.split("T")[0];
		let vidObj: Video;
		if (vid.subtitles) {
			// If the video isn't deleted and is still up
			vidObj = {
				title: vid.title.split(" ").slice(1).join(" "),
				video: vid.titleUrl,
				channel: vid.subtitles[0].name,
				time: vid.time,
				channelURL: vid.subtitles[0].url,
			};
		} else {
			// If it is deleted
			vidObj = {
				title: vid.title.split(" ").slice(1).join(" "),
				video: vid.titleUrl,
				channel: "[deleted or unknown]",
				time: vid.time,
			};
		}
		if (vidObj.channel in topChannels) {
			topChannels[vidObj.channel].videosWatched += 1;
		} else {
			topChannels[vidObj.channel] = {
				channelURL: vidObj.channelURL,
				videosWatched: 1,
			};
		}
		if (dateKey in groupedByDate) {
			groupedByDate[dateKey].push(vidObj);
		} else {
			groupedByDate[dateKey] = [vidObj];
		}
	});

	return {
		days: groupedByDate,
		top: sortTopChannels(topChannels),
	};
}

const monthMap = {
	"01": "January",
	"02": "February",
	"03": "March",
	"04": "April",
	"05": "May",
	"06": "June",
	"07": "July",
	"08": "August",
	"09": "September",
	"10": "October",
	"11": "November",
	"12": "December",
};

export function getStats(days: Days) {
	const reversedDays = Object.fromEntries(Object.entries(days).reverse());
	const videosPerDay: number[] = [];
	const videosOverYear: number[] = [];
	const months: MonthData = {};
	const dates = Object.keys(reversedDays);

	for (const day in reversedDays) {
		videosPerDay.push(reversedDays[day].length);
		let m = day.split("-")[1];
		if (m in months) {
			months[m] += reversedDays[day].length;
		} else {
			months[m] = reversedDays[day].length;
		}
		// culmulative
		const today = reversedDays[day].length;
		videosOverYear.push(
			videosOverYear.length == 0 ? today : videosOverYear.slice(-1)[0] + today
		);
	}

	let maxMonthKey = "01";
	let maxMonthValue = -Infinity;
	let maxDayKey = "null";
	let maxDayValue = -Infinity;

	for (const key in months) {
		if (months[key] > maxMonthValue) {
			maxMonthValue = months[key];
			maxMonthKey = key.toString();
		}
	}

	for (let i = 0; i < dates.length; i++) {
		if (videosPerDay[i] > maxDayValue) {
			maxDayValue = videosPerDay[i];
			maxDayKey = dates[i];
		}
	}

	return {
		// @ts-ignore
		mostWatchedMonth: monthMap[maxMonthKey],
		mostWatchedMonthValue: maxMonthValue,
		mostWatchedDay: new Date(maxDayKey).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}),
		mostWatchedDayValue: maxDayValue,
		dates,
		videosOverYear,
		videosPerDay,
	};
}

export function totalVideos(days: Days) {
	return Object.values(days).reduce((sum, day) => sum + day.length, 0);
}

export function average(days: Days, duration: number) {
	const totalVideosWatched = totalVideos(days);
	// meh it works
	return parseFloat((totalVideosWatched / duration).toLocaleString()).toFixed();
}
