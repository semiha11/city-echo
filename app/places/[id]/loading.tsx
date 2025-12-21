export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                <div className="flex gap-4">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-48"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-32"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Image Skeleton */}
                    <div className="aspect-[16/9] w-full bg-gray-200 rounded-2xl"></div>

                    {/* Description Skeleton */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
