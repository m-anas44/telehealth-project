"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandItem, CommandList } from "@/components/ui/command";

interface SpecializationSelectorProps {
  options: string[];
  value?: string[];
  onChange?: (values: string[]) => void;
  maxSelect?: number;
  placeholder?: string;
}

export default function SpecializationSelector({
  options,
  value = [],
  onChange,
  maxSelect = 3,
  placeholder = "Search specializations...",
}: SpecializationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(value || []);

  useEffect(() => {
    setSelected(value || []);
  }, [value]);

  const lowerQuery = query.toLowerCase();
  const filtered = useMemo(() => {
    return options.filter((opt) => opt.toLowerCase().includes(lowerQuery));
  }, [options, lowerQuery]);

  const toggle = useCallback(
    (opt: string) => {
      setSelected((prev) => {
        const exists = prev.includes(opt);
        if (exists) {
          const next = prev.filter((p) => p !== opt);
          return next;
        }
        if (prev.length >= (maxSelect || 3)) return prev;
        const next = [...prev, opt];
        return next;
      });
    },
    [onChange, maxSelect],
  );

  const remove = useCallback(
    (opt: string) => {
      setSelected((prev) => {
        const next = prev.filter((p) => p !== opt);
        return next;
      });
    },
    [onChange],
  );

  // propagate selected -> parent AFTER render to avoid setState-in-render
  const arraysEqual = (a: string[], b: string[]) => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  useEffect(() => {
    // avoid calling onChange if parent value already equals selected to prevent update loops
    if (!onChange) return;
    if (arraysEqual(selected, value || [])) return;
    onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // ensure no duplicates from options or initial value
  const uniqOptions = useMemo(() => Array.from(new Set(options)), [options]);

  const isAtMax = selected.length >= (maxSelect || 3);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Specializations
      </label>
      <p className="text-xs text-gray-500 mb-2">
        Select up to {maxSelect} areas of expertise
      </p>

      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map((s) => (
          <Badge
            key={s}
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <span>{s}</span>
            <button
              aria-label={`Remove ${s}`}
              onClick={() => remove(s)}
              className="ml-2 text-xs opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-75 p-0">
          <Command>
            <div className="p-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full px-2 py-1 border rounded-md outline-none"
                aria-label="Search specializations"
              />
            </div>
            <CommandList>
              {filtered.length === 0 && (
                <div className="p-3 text-sm text-gray-500">No results.</div>
              )}
              {filtered.map((opt) => {
                const disabled = isAtMax && !selected.includes(opt);
                const checked = selected.includes(opt);
                return (
                  <CommandItem
                    key={opt}
                    onSelect={() => toggle(opt)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    aria-disabled={disabled}
                  >
                    <span>{opt}</span>
                    <span className="text-sm text-gray-500">
                      {checked ? "Selected" : ""}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
