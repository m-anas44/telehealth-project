"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <Card key={item}>
          <CardContent className="py-1">
            <div className="flex items-center gap-4">
              {/* Icon skeleton */}
              <Skeleton className="w-14 h-14 rounded-lg shrink-0" />

              <div className="flex-1">
                {/* Title */}
                <Skeleton className="h-4 w-40 mb-3" />

                {/* Date + badge */}
                <div className="flex items-center gap-6">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-14 rounded-md" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardSkeleton;
