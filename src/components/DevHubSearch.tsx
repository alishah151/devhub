import { useEffect, useState } from "react";

interface SearchResult {
  id: string;
  collection: string;
  slug: string;
  title: string;
  snippet?: string;
}

interface SearchResponse {
  data?: {
    items?: SearchResult[];
  };
}

interface Props {
  placeholder?: string;
}

function getResultUrl(result: SearchResult) {
  if (result.collection === "pages") {
    return `/${result.slug.replace(/^\/+/, "")}`;
  }

  if (result.collection === "posts") {
    return `/posts/${result.slug.replace(/^\/+/, "")}`;
  }

  return `/${result.slug.replace(/^\/+/, "")}`;
}

export default function DevHubSearch({
  placeholder = "Search documentation...",
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          q: trimmed,
          collections: "posts,pages",
          limit: "10",
        });

        const response = await fetch(`/_emdash/api/search?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const payload = (await response.json()) as SearchResponse;
        setResults(payload.data?.items ?? []);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="devhub-search">
      <input
        type="search"
        value={query}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
      />

      {open && (
        <>
          <button
            type="button"
            className="devhub-search-backdrop"
            aria-label="Close search results"
            onClick={() => setOpen(false)}
          />

          <div className="devhub-search-results">
            {loading && (
              <div className="devhub-search-status">Searching...</div>
            )}

            {!loading && results.length === 0 && (
              <div className="devhub-search-status">No results found.</div>
            )}

            {!loading &&
              results.map((result) => (
                <a
                  key={`${result.collection}-${result.id}`}
                  href={getResultUrl(result)}
                  className="devhub-search-result"
                  onClick={() => setOpen(false)}
                >
                  <span className="devhub-search-result-title">
                    {result.title}
                  </span>

                  <span className="devhub-search-result-collection">
                    {result.collection}
                  </span>

                  {result.snippet && (
                    <span
                      className="devhub-search-result-snippet"
                      dangerouslySetInnerHTML={{ __html: result.snippet }}
                    />
                  )}
                </a>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
