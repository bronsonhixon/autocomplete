// src/components/SearchBar.ts
import { getAutocompleteSuggestions } from "../services/AutocompleteService";

class SearchBar {
  private container: HTMLElement;
  private measureEl: HTMLElement;
  private typedEl: HTMLElement;
  private suggestionEl: HTMLElement;
  private inputElement: HTMLInputElement;
  private currentSuggestion = "";
  private onSearch: (query: string) => void;

  constructor(
    inputSelector: string,
    onSearch: (query: string) => void
  ) {
    this.inputElement = document.querySelector(inputSelector) as HTMLInputElement;
    this.container = this.inputElement.closest(".autocomplete-container") as HTMLElement;

    this.measureEl = this.container.querySelector(".measure") as HTMLElement;
    this.typedEl = this.container.querySelector(".typed") as HTMLElement;
    this.suggestionEl = this.container.querySelector(".suggestion") as HTMLElement;

    this.onSearch = onSearch;
    this.initialize();
  }

  initialize() {
    // Listen for every keystroke
    this.inputElement.addEventListener("input", this.handleInput.bind(this));
    this.inputElement.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  async handleInput() {
    const query = this.inputElement.value;

    // Always display typed text in black (.typed)
    this.typedEl.textContent = query;
    // For positioning
    this.measureEl.textContent = query;

    // **Hide any existing suggestion** immediately to avoid overlap
    this.suggestionEl.textContent = "";
    this.currentSuggestion = "";

    if (query.length === 0) {
      // If empty, just return
      return;
    }

    // Fetch new suggestions
    const suggestions = await getAutocompleteSuggestions(query);
    if (suggestions.length > 0) {
      this.currentSuggestion = cleanSuggestion(suggestions[0]);
    } else {
      this.currentSuggestion = "";
    }

    this.updateSuggestionPosition();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight" && this.currentSuggestion) {
      // Accept the suggestion
      this.inputElement.value = this.currentSuggestion;
      this.typedEl.textContent = this.currentSuggestion;
      this.measureEl.textContent = this.currentSuggestion;
      this.currentSuggestion = "";
      this.suggestionEl.textContent = "";
    } else if (event.key === "Escape") {
      // Clear suggestion on escape
      this.currentSuggestion = "";
      this.suggestionEl.textContent = "";
    } else if (event.key === "Enter") {
      // On Enter, call onSearch
      event.preventDefault();
      const finalQuery = this.inputElement.value;
      this.onSearch(finalQuery);
    }
  }

  updateSuggestionPosition() {
    const typedText = this.inputElement.value;
    if (
      !this.currentSuggestion ||
      !this.currentSuggestion.startsWith(typedText)
    ) {
      this.suggestionEl.textContent = "";
      return;
    }

    // Show remainder
    const remainder = this.currentSuggestion.slice(typedText.length);
    this.suggestionEl.textContent = remainder;

    // Position it immediately after typed text
    const typedWidth = this.measureEl.offsetWidth;
    const leftPadding = 14;
    this.suggestionEl.style.left = typedWidth + leftPadding + "px";
  }
}

/** Clean up text like "Complete this search: " or quotes */
function cleanSuggestion(s: string): string {
  return s.replace(/^(Complete this search: )?"/, "").replace(/"$/, "").trim();
}

export default SearchBar;