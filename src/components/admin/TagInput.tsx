"use client";

import { useState, useRef, useEffect } from "react";
import { X, Tag, ChevronDown } from "lucide-react";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
  label?: string;
  helperText?: string;
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  maxTags = 20,
  className = "",
  label,
  helperText = "Press Enter or Tab to select suggestion. Comma-separated values.",
}: TagInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Parse current tags from the comma-separated value
  const currentTags = value.split(",").map(t => t.trim()).filter(Boolean);
  const lastTag = currentTags[currentTags.length - 1] || "";
  const prefix = currentTags.slice(0, -1).join(", ") + (currentTags.length > 1 ? ", " : "");

  // Filter suggestions based on the last tag being typed
  const filteredSuggestions = suggestions
    .filter(tag =>
      tag.toLowerCase().includes(lastTag.toLowerCase()) &&
      !currentTags.slice(0, -1).includes(tag)
    )
    .slice(0, 10);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case "Tab":
        if (highlightedIndex >= 0) {
          e.preventDefault();
          selectSuggestion(filteredSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const newTags = [...currentTags.slice(0, -1), suggestion];
    if (newTags.length < maxTags) {
      onChange(newTags.join(", ") + ", ");
    }
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click selection
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFocus = () => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const removeTag = (index: number) => {
    const newTags = currentTags.filter((_, i) => i !== index);
    onChange(newTags.join(", ") + (newTags.length > 0 ? ", " : ""));
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}

      {/* Selected Tags Display */}
      {currentTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {currentTags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-safety/20 border border-safety/30 text-safety rounded-full text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-0.5 hover:bg-safety/30 rounded-full transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
          placeholder={placeholder}
          autoComplete="off"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-white/10 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  index === highlightedIndex
                    ? "bg-safety/20 text-safety"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Tag size={14} className="mr-2 inline-block" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-1">{helperText}</p>
    </div>
  );
}