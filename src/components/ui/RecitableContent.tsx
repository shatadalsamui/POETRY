"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  buildRecitationPlan,
  RecitableSegment,
} from "@/lib/audio/chunkBengaliText";
import { recitationStore } from "@/lib/audio/recitationStore";

interface RecitableContentProps {
  workId: string;
  title: string;
  content: string;
  book?: string;
  type: "poem" | "story";
  className?: string;
}

interface ActiveRecitationSnapshot {
  isActive: boolean;
  isIntroChunk: boolean;
  activeSegmentIndex: number;
}

const SERVER_SNAPSHOT: ActiveRecitationSnapshot = {
  isActive: false,
  isIntroChunk: false,
  activeSegmentIndex: -1,
};

function findActiveSegmentIndex(
  segments: RecitableSegment[],
  chunkIndex: number,
  chunkProgress: number
): number {
  if (chunkIndex < 1) return -1;

  let fallbackIdx = -1;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.isBreak || seg.chunkIndex !== chunkIndex) continue;
    if (fallbackIdx === -1) fallbackIdx = i;
    if (chunkProgress >= seg.startRatio && chunkProgress <= seg.endRatio + 0.001) {
      return i;
    }
    if (chunkProgress > seg.endRatio) {
      fallbackIdx = i;
    }
  }
  return fallbackIdx;
}

export default function RecitableContent({
  workId,
  title,
  content,
  book,
  type,
  className = "",
}: RecitableContentProps) {
  const { segments } = useMemo(
    () => buildRecitationPlan({ title, content, book, type }),
    [title, content, book, type]
  );

  const lastSnapshotRef = useRef<ActiveRecitationSnapshot>(SERVER_SNAPSHOT);

  // Memoized selector: only returns a new reference when the active line
  // or recitation status actually changes, skipping 13+ unnecessary renders/sec
  const getSnapshot = useCallback((): ActiveRecitationSnapshot => {
    const playback = recitationStore.getSnapshot();
    const isActive = playback.workId === workId && playback.status !== "idle";
    const isIntroChunk = isActive && playback.chunkIndex === 0;
    const activeSegmentIndex = isActive
      ? findActiveSegmentIndex(
          segments,
          playback.chunkIndex,
          playback.chunkProgress
        )
      : -1;

    const prev = lastSnapshotRef.current;
    if (
      prev.isActive === isActive &&
      prev.isIntroChunk === isIntroChunk &&
      prev.activeSegmentIndex === activeSegmentIndex
    ) {
      return prev;
    }

    const next: ActiveRecitationSnapshot = {
      isActive,
      isIntroChunk,
      activeSegmentIndex,
    };
    lastSnapshotRef.current = next;
    return next;
  }, [workId, segments]);

  const { isActive, isIntroChunk, activeSegmentIndex } = useSyncExternalStore(
    recitationStore.subscribe,
    getSnapshot,
    () => SERVER_SNAPSHOT
  );

  const segmentRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Viewport-aware smooth scroll: only scroll when the line is near screen bounds
  useEffect(() => {
    if (!isActive || activeSegmentIndex < 0) return;
    const node = segmentRefs.current.get(activeSegmentIndex);
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const topSafe = 140; // below sticky top bar
    const bottomSafe = window.innerHeight - 140;

    // If node is already comfortably visible, skip scrolling to avoid stutter
    if (rect.top >= topSafe && rect.bottom <= bottomSafe) {
      return;
    }

    node.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [isActive, activeSegmentIndex]);

  const setSegmentRef = (idx: number, el: HTMLElement | null) => {
    if (el) {
      segmentRefs.current.set(idx, el);
    } else {
      segmentRefs.current.delete(idx);
    }
  };

  if (type === "poem") {
    return (
      <div
        className={`reading-poem-body text-[15px] sm:text-xl md:text-2xl text-[var(--color-ink)] font-medium leading-[2.4] sm:leading-[2.8] font-serif w-full text-center tracking-normal selection:bg-[#982b1b]/15 break-normal transition-[font-size] duration-200 ${className}`}
      >
        {isIntroChunk && (
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--color-antique-gold)]/20 border border-[var(--color-antique-gold)]/50 text-xs sm:text-sm text-[var(--color-accent)] font-semibold animate-pulse">
            <span>🎙️ শিরোনাম ও কবি পরিচিতি পাঠ চলছে...</span>
          </div>
        )}

        <div className="flex flex-col items-center w-full">
          {segments.map((seg, idx) => {
            if (seg.isBreak) {
              return <div key={idx} className="h-6 sm:h-8 w-full" aria-hidden="true" />;
            }

            const isCurrent = isActive && idx === activeSegmentIndex;
            const isPast =
              isActive &&
              activeSegmentIndex >= 0 &&
              idx < activeSegmentIndex;

            return (
              <div
                key={idx}
                ref={(el) => setSegmentRef(idx, el)}
                onClick={
                  isActive
                    ? () =>
                        recitationStore.requestSeek(
                          seg.chunkIndex,
                          seg.startRatio
                        )
                    : undefined
                }
                title={
                  isActive ? "এই পঙক্তি থেকে শুনতে ক্লিক করুন" : undefined
                }
                className={`px-3 py-0.5 rounded-sm transition-colors duration-200 max-w-full ${
                  isCurrent
                    ? "bg-[var(--color-antique-gold)]/25 text-[var(--color-accent)] ring-1 ring-[var(--color-antique-gold)]/55 shadow-2xs"
                    : isPast
                    ? "opacity-80 hover:opacity-100 hover:bg-[var(--color-antique-gold)]/10 cursor-pointer"
                    : isActive
                    ? "hover:bg-[var(--color-antique-gold)]/10 cursor-pointer"
                    : ""
                }`}
              >
                {seg.text}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Group story sentence segments back into their original paragraphs
  const paragraphsMap = new Map<
    number,
    Array<{ seg: RecitableSegment; idx: number }>
  >();
  segments.forEach((seg, idx) => {
    const pIdx = seg.paragraphIndex ?? 0;
    const list = paragraphsMap.get(pIdx) || [];
    list.push({ seg, idx });
    paragraphsMap.set(pIdx, list);
  });

  const paragraphEntries = Array.from(paragraphsMap.entries());

  return (
    <div
      className={`reading-story-body text-lg sm:text-xl text-[var(--color-ink)] font-medium leading-loose text-justify font-serif space-y-8 w-full selection:bg-[#113624]/15 transition-[font-size] duration-200 ${className}`}
    >
      {isIntroChunk && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--color-antique-gold)]/20 border border-[var(--color-antique-gold)]/50 text-xs sm:text-sm text-[var(--color-accent)] font-semibold animate-pulse">
            <span>🎙️ শিরোনাম ও লেখিকা পরিচিতি পাঠ চলছে...</span>
          </div>
        </div>
      )}

      {paragraphEntries.map(([pIdx, items]) => (
        <p key={pIdx}>
          {items.map(({ seg, idx }, itemPos) => {
            const isCurrent = isActive && idx === activeSegmentIndex;
            return (
              <React.Fragment key={idx}>
                <span
                  ref={(el) => setSegmentRef(idx, el)}
                  onClick={
                    isActive
                      ? () =>
                          recitationStore.requestSeek(
                            seg.chunkIndex,
                            seg.startRatio
                          )
                      : undefined
                  }
                  title={
                    isActive ? "এই বাক্য থেকে শুনতে ক্লিক করুন" : undefined
                  }
                  className={`transition-colors duration-200 rounded-xs ${
                    isCurrent
                      ? "bg-[var(--color-antique-gold)]/30 text-[var(--color-accent)] px-1.5 py-0.5 ring-1 ring-[var(--color-antique-gold)]/50 shadow-2xs"
                      : isActive
                      ? "hover:bg-[var(--color-antique-gold)]/15 cursor-pointer"
                      : ""
                  }`}
                >
                  {seg.text}
                </span>
                {itemPos < items.length - 1 ? " " : ""}
              </React.Fragment>
            );
          })}
        </p>
      ))}
    </div>
  );
}
