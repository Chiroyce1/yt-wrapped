import { YOUTUBE_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async (req: RequestEvent) => {
	const body = await req.request.json();
	if (!body.channels) {
		return json({ error: "Channel URL is required." }, { status: 400 });
	}

	const channelIDs = body.channels.join(",");
	const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIDs}&key=${YOUTUBE_API_KEY}`;

	const response = await fetch(url);
	const data = await response.json();
	let channels = data.items;
	// extract the `id` and `snippet.thumbnails.high.url` from eahc channel
	channels = channels.map((channel: any) => {
		const { id, snippet } = channel;
		const { thumbnails } = snippet;
		const { high } = thumbnails;
		const { url } = high;
		return { id, url };
	});

	// convert to object with channel id as key and thumbnail url as value
	channels = channels.reduce((acc: Record<string, string>, channel: any) => {
		acc[channel.id] = channel.url;
		return acc;
	}, {});

	return json(channels);
};
