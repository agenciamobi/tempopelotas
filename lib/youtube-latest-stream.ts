import "server-only";

import { unstable_cache } from "next/cache";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
export const YOUTUBE_LARANJAL_CHANNEL_URL =
  "https://www.youtube.com/@praiadolaranjal/streams";

export type YouTubeStreamStatus = "live" | "replay";

export type YouTubeLatestStream = {
  videoId: string;
  title: string;
  status: YouTubeStreamStatus;
  watchUrl: string;
  embedUrl: string;
  thumbnailUrl: string | null;
  publishedAt: string;
};

type ChannelResponse = {
  items?: Array<{
    id: string;
    contentDetails?: {
      relatedPlaylists?: { uploads?: string };
    };
  }>;
};

type PlaylistResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
  }>;
};

type VideosResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: Record<string, { url?: string }>;
    };
    liveStreamingDetails?: {
      actualStartTime?: string;
      actualEndTime?: string;
      scheduledStartTime?: string;
    };
    status?: { embeddable?: boolean; privacyStatus?: string };
  }>;
};

async function youtubeRequest<T>(
  resource: string,
  parameters: Record<string, string>,
  apiKey: string,
): Promise<T> {
  const url = new URL(`${YOUTUBE_API}/${resource}`);
  Object.entries(parameters).forEach(([name, value]) => {
    url.searchParams.set(name, value);
  });
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`YouTube ${resource} respondeu com status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function thumbnailUrl(
  thumbnails: Record<string, { url?: string }> | undefined,
) {
  return (
    thumbnails?.maxres?.url ??
    thumbnails?.standard?.url ??
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    null
  );
}

const getCachedLatestStream = unstable_cache(
  async (apiKey: string, handle: string): Promise<YouTubeLatestStream | null> => {
    const channels = await youtubeRequest<ChannelResponse>(
      "channels",
      { part: "id,contentDetails", forHandle: handle },
      apiKey,
    );
    const uploadsPlaylist =
      channels.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylist) return null;

    const playlist = await youtubeRequest<PlaylistResponse>(
      "playlistItems",
      {
        part: "contentDetails",
        playlistId: uploadsPlaylist,
        maxResults: "12",
      },
      apiKey,
    );
    const videoIds = (playlist.items ?? [])
      .map((item) => item.contentDetails?.videoId)
      .filter((videoId): videoId is string => Boolean(videoId));

    if (!videoIds.length) return null;

    const videos = await youtubeRequest<VideosResponse>(
      "videos",
      {
        part: "snippet,liveStreamingDetails,status",
        id: videoIds.join(","),
      },
      apiKey,
    );

    const streams = (videos.items ?? [])
      .filter(
        (video) =>
          video.liveStreamingDetails &&
          video.status?.embeddable !== false &&
          video.status?.privacyStatus === "public" &&
          video.snippet?.publishedAt &&
          video.snippet?.title,
      )
      .sort(
        (a, b) =>
          new Date(b.snippet!.publishedAt!).getTime() -
          new Date(a.snippet!.publishedAt!).getTime(),
      );

    const selected =
      streams.find(
        (video) =>
          video.liveStreamingDetails?.actualStartTime &&
          !video.liveStreamingDetails?.actualEndTime,
      ) ?? streams.find((video) => video.liveStreamingDetails?.actualEndTime);

    if (!selected) return null;

    const status: YouTubeStreamStatus =
      selected.liveStreamingDetails?.actualStartTime &&
      !selected.liveStreamingDetails?.actualEndTime
        ? "live"
        : "replay";

    return {
      videoId: selected.id,
      title: selected.snippet!.title!,
      status,
      watchUrl: `https://www.youtube.com/watch?v=${selected.id}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${selected.id}`,
      thumbnailUrl: thumbnailUrl(selected.snippet?.thumbnails),
      publishedAt: selected.snippet!.publishedAt!,
    };
  },
  ["youtube-laranjal-latest-stream-v1"],
  { revalidate: 300 },
);

export async function getLatestLaranjalStream() {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const handle = process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || "@praiadolaranjal";

  if (!apiKey) return null;

  try {
    return await getCachedLatestStream(apiKey, handle);
  } catch (error) {
    console.warn("[youtube-laranjal] transmissão indisponível", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
}
