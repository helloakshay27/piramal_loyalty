import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import "./list-toolbar.css";

const ListSearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  onReset,
  onRefresh,
  showGo = false,
  onGo,
  suggestions = [],
  getSuggestionKey = (item, index) => index,
  renderSuggestion = (item) => String(item),
  onSuggestionClick,
  highlightedIndex = -1,
  onKeyDown,
  className = "",
}) => {
  const handleKeyDown = (e) => {
    if (onKeyDown) onKeyDown(e);
    if (e.key === "Enter" && onGo) {
      e.preventDefault();
      onGo();
    }
  };

  return (
    <div className={`lockated-list-toolbar ${className}`.trim()}>
      <div className="lockated-list-search">
        <Search size={16} className="lockated-list-search__icon" aria-hidden />
        <input
          type="search"
          className="lockated-list-search__input form-control"
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        {value ? (
          <button
            type="button"
            className="lockated-list-search__clear"
            aria-label="Clear search"
            onClick={onReset}
          >
            <X size={16} />
          </button>
        ) : null}

        {suggestions.length > 0 && (
          <ul className="lockated-list-search__suggestions" role="listbox">
            {suggestions.map((item, index) => (
              <li
                key={getSuggestionKey(item, index)}
                role="option"
                className={`lockated-list-search__suggestion${
                  highlightedIndex === index ? " is-highlighted" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSuggestionClick?.(item)}
              >
                {renderSuggestion(item)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showGo && onGo ? (
        <button
          type="button"
          className="lockated-list-toolbar__btn lockated-list-toolbar__btn--primary"
          onClick={onGo}
        >
          Search
        </button>
      ) : null}

      {onReset ? (
        <button
          type="button"
          className="lockated-list-toolbar__btn lockated-list-toolbar__btn--secondary"
          onClick={onReset}
        >
          Reset
        </button>
      ) : null}

      {onRefresh ? (
        <button
          type="button"
          className="lockated-list-toolbar__btn lockated-list-toolbar__btn--secondary"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <RotateCcw size={16} />
        </button>
      ) : null}
    </div>
  );
};

export default ListSearchBar;
