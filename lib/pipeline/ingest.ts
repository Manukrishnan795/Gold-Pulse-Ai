import { createHash } from "crypto";
import { createServerClient } from "../supabase/server";
import { fetchFeed } from "../news/rss";
import { RSS_SOURCES, isLikelyGoldRelevant } from "../news/sources";
import type { RawFeedItem } from "../types";

function contentHash(item: RawFeedItem): string {
  const normalized = `${item.title} ${item.raw_content}`
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
  return createHash("sha256").update(normalized).digest("hex");
}

export interface IngestResult {
  source: string;
  fetched: number;
  keywordRelevant: number;
  inserted: number;
  skippedDuplicate: number;
  error?: string;
}

export async function runIngestion(): Promise<IngestResult[]> {
  const supabase = createServerClient();
  const results: IngestResult[] = [];

  for (const source of RSS_SOURCES) {
    const result: IngestResult = {
      source: source.name,
      fetched: 0,
      keywordRelevant: 0,
      inserted: 0,
      skippedDuplicate: 0,
    };

    try {
      const items = await fetchFeed(source);
      result.fetched = items.length;

      const relevant = items.filter((item) =>
        isLikelyGoldRelevant(`${item.title} ${item.raw_content}`)
      );
      result.keywordRelevant = relevant.length;

      for (const item of relevant) {
        const hash = contentHash(item);

        const { data: existingByHash } = await supabase
          .from("articles")
          .select("id")
          .eq("content_hash", hash)
          .limit(1);

        if (existingByHash && existingByHash.length > 0) {
          result.skippedDuplicate++;
          continue;
        }

        const { error } = await supabase.from("articles").upsert(
          {
            source: item.source,
            source_url: item.source_url,
            title: item.title,
            raw_content: item.raw_content,
            content_hash: hash,
            published_at: item.published_at,
            status: "pending",
          },
          { onConflict: "source_url", ignoreDuplicates: true }
        );

        if (error) throw error;
        result.inserted++;
      }
    } catch (err) {
      result.error = err instanceof Error ? err.message : String(err);
    }

    results.push(result);
  }

  return results;
}
