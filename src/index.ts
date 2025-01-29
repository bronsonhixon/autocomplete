// src/index.ts
import SearchBar from "./components/SearchBar";

// The listing URL prefix
const BASE_LISTING_URL = "https://dev.rhome.com/listing";

document.addEventListener("DOMContentLoaded", () => {
  // Our onSearch callback
  function onSearch(query: string) {
    // Build final URL
    const encoded = encodeURIComponent(JSON.stringify({ searchQuery: query }));
    const finalUrl = `${BASE_LISTING_URL}?filters=${encoded}`;

    // Navigate in the same tab
    window.location.href = finalUrl;
  }

  // Initialize SearchBar
  const searchBar = new SearchBar("#search-input", onSearch);

  // Hook up the "Go" button
  const goButton = document.getElementById("search-button");
  goButton?.addEventListener("click", () => {
    // Use the input's current value
    const userQuery = (document.querySelector("#search-input") as HTMLInputElement).value;
    onSearch(userQuery);
  });
});