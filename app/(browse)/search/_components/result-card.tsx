import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import  { Thumbnail,ThumbnailSkeleton } from "@/components/thumbnail";
import { VerifiedMark } from "@/components/verified-mark";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomUser {
	username: string;
	imageUrl: string;
};

interface ResultcardProps {
	data: {
		user: CustomUser;
		isLive: boolean;
		thumbnailUrl: string | null;
		name: string;
		updatedAt: Date;
	};
};

export const ResultCard = ({ data }: ResultcardProps) => {
	return (
		<Link href={`/${data.user.username}`}>
			<div className="w-full flex gap-x-4">
				<div className="relative h-[9rem] w-[16rem]">
					<Thumbnail
						isLive={data.isLive}
						src={data.thumbnailUrl}
						fallback={data.user.imageUrl}
						username={data.user.username}
					/>
				</div>
				<div className="space-y-1">
					<div className="flex items-center gap-x-2">
						<p className="font-bold text-lg cursor-pointer hover:text-blue-500">
							{data.user.username}
						</p>
						<VerifiedMark />
					</div>
					<p className="text-sm text-muted-foreground">{data.name}</p>
					<p className="text-sm text-muted-foreground">
						{formatDistanceToNow(new Date(data.updatedAt), {
							addSuffix: true,
						})}
					</p>
				</div>
			</div>
		</Link>
	);
};

export const ResultCardSkeleton = () => {
	return (
		<div className="w-full flex gap-x-4">
			<div className="relative h-[9rem] w-[16rem]">
				<ThumbnailSkeleton />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-3 w-12" />
			</div>
		</div>
	);
}

