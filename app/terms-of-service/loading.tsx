import { Skeleton } from "@/components/ui/skeleton"

export default function TermsOfServiceLoading() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="space-y-8">
        <div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          <div className="py-4">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-4/5 mt-2" />
          </div>

          <div className="py-4">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </div>

          <div className="py-4">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
        </div>

        <div className="border-t pt-8 mt-12">
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
