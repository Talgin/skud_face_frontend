import { Skeleton } from '@/shared/ui/skeleton';
import React from 'react';

export function TableSkeleton() {
	return (
		<div>
			<Skeleton className="h-4 w-[100%]" />
			<Skeleton className="h-4 w-[100%] mt-3" />
			<Skeleton className="h-4 w-[100%] mt-3" />
			<Skeleton className="h-4 w-[100%] mt-3" />
			<Skeleton className="h-4 w-[100%] mt-3" />
			<Skeleton className="h-4 w-[100%] mt-3" />
			<Skeleton className="h-4 w-[100%] mt-3" />
		</div>
	);
}
