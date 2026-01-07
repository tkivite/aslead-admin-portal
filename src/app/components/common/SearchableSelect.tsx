"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronDown, Search } from "lucide-react"

export type Option = {
  value: string | number
  label: string
  meta?: string
}

interface SearchableSelectProps {
  options: Option[]
  value?: string | number | null
  onChange: (value: string | number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  searchable?: boolean
}

export default function SearchableSelect({
  options,
  value = null,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
  searchable = true,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [filtered, setFiltered] = useState<Option[]>(options)
  const [highlightIdx, setHighlightIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setFiltered(
      options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()) || (o.meta || "").toLowerCase().includes(query.toLowerCase()))
    )
    setHighlightIdx(0)
  }, [query, options])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  useEffect(() => {
    // Reset query when closed
    if (!open) setQuery("")
  }, [open])

  const selected = options.find((o) => o.value === value)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filtered[highlightIdx]
      if (item) {
        onChange(item.value)
        setOpen(false)
      }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          if (disabled) return
          setOpen((o) => !o)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className={`w-full text-left px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between gap-2 ${disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : "bg-white"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="truncate text-sm text-gray-700">{selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded p-1">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Search..."
                />
              </div>
            </div>
          )}

          <ul role="listbox" className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 && <li className="p-2 text-sm text-gray-500">No results</li>}
            {filtered.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                tabIndex={-1}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                onMouseEnter={() => setHighlightIdx(idx)}
                className={`cursor-pointer p-2 rounded text-sm flex items-center justify-between ${idx === highlightIdx ? "bg-primary/5" : "hover:bg-gray-50"} ${opt.value === value ? "font-semibold" : ""}`}
              >
                <div className="truncate">
                  <div className="text-sm text-gray-700">{opt.label}</div>
                  {opt.meta && <div className="text-xs text-gray-500">{opt.meta}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
