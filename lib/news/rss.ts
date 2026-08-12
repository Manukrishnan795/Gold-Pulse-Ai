import Parser from "rss-parser";
import type { NewsSource } from "./sources";
import type { RawFeedItem } from "../types";

const parser = new Parser({ timeout: 15000 });

export async function fetchFeed(source: NewsSource): Promise<RawFeedItem[]> {
  const feed = await parser.parseURL(source.url);

  return (feed.items ?? [])
    .filter((item) => item.link && item.title)
    .map((item) => ({
      source: source.name,
      source_url: item.link as string,
      title: item.title as string,
      raw_content: item.contentSnippet ?? item.content ?? item.summary ?? "",
      published_at: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
    }));
}
