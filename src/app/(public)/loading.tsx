export default function Loading() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 animate-pulse">
            {/* Hero skeleton */}
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-full" />
                        <div className="space-y-3">
                            <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            <div className="h-12 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                        </div>
                        <div className="h-5 w-full bg-gray-100 dark:bg-gray-800/60 rounded-lg" />
                        <div className="h-5 w-3/4 bg-gray-100 dark:bg-gray-800/60 rounded-lg" />
                        <div className="flex gap-4">
                            <div className="h-12 w-36 bg-indigo-200 dark:bg-indigo-900 rounded-full" />
                            <div className="h-12 w-36 bg-gray-200 dark:bg-gray-800 rounded-full" />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-64 h-80 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
                    </div>
                </div>
            </div>

            {/* Stats skeleton */}
            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="text-center space-y-2">
                            <div className="h-10 w-16 mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg" />
                            <div className="h-4 w-24 mx-auto bg-gray-100 dark:bg-gray-800/60 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section skeleton */}
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 space-y-3">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/60 rounded" />
                            <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800/60 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
