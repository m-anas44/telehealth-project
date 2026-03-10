import { Card, CardContent } from "@/components/ui/card";

const AppointmentSkeleton = () => {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm animate-pulse py-4">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* 1. Left Section: Profile & Info Skeleton */}
          <div className="relative flex items-center gap-4 p-4 sm:p-6 flex-1">
            {/* Fake Status Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200" />

            {/* Avatar Placeholder */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200 shrink-0" />

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                {/* Name Placeholder */}
                <div className="h-5 w-32 bg-slate-200 rounded-md" />
                {/* Badge Placeholder */}
                <div className="h-4 w-16 bg-slate-100 rounded-full" />
              </div>

              {/* Specialization Tags Placeholder */}
              <div className="flex gap-2">
                <div className="h-4 w-20 bg-slate-100 rounded-md" />
                <div className="h-4 w-16 bg-slate-100 rounded-md" />
              </div>

              {/* Meta Info Placeholder (Date/Time) */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                <div className="h-4 w-24 bg-slate-100 rounded-md" />
                <div className="h-4 w-20 bg-slate-100 rounded-md" />
                <div className="h-4 w-16 bg-slate-100 rounded-md" />
              </div>
            </div>
          </div>

          {/* 2. Right Section: Action Buttons Skeleton */}
          <div className="flex items-center bg-slate-50/50 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-slate-100 p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:flex sm:flex-col lg:flex-row gap-2 w-full sm:w-auto">
              {/* Primary Action Placeholder */}
              <div className="h-10 w-full sm:w-28 bg-slate-200 rounded-md col-span-2 lg:col-span-1" />
              {/* Secondary Action Placeholder */}
              <div className="h-10 w-full sm:w-28 bg-slate-100 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentSkeleton;
