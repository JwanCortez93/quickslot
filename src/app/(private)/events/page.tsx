import CopyCatalogButton from "@/components/CopyCatalogButton";
import CopyEventButton from "@/components/CopyEventButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { formatEventDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarX } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

const EventsPage = async () => {
  const { userId, redirectToSignIn } = auth();

  if (userId === null) return redirectToSignIn();

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  return (
    <>
      <div className="flex items-baseline justify-between">
        <div className="flex gap-4">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
            Events
          </h1>
          <Button asChild>
            <Link href="/events/new">
              <CalendarPlus className="mr-4 size-6" />
              New Event
            </Link>
          </Button>
        </div>
        <CopyCatalogButton variant="outline" clerkUserId={userId} />
      </div>
      {events.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <CalendarX className="size-16 mx-auto" />
          You have no events yet.
          <Button size="lg" className="text-lg" asChild>
            <Link href="/events/new">
              <CalendarPlus className="mr-4 size-6" />
              New Event
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

interface EventCardProps {
  id: string;
  isActive: boolean;
  name: string;
  description: string | null;
  durationInMinutes: number;
  clerkUserId: string;
}

const EventCard = ({
  id,
  isActive,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventCardProps) => (
  <Card className={cn("flex flex-col", !isActive && "border-secondary")}>
    <CardHeader className={cn(!isActive && "opacity-50")}>
      <CardTitle>{name}</CardTitle>
      <CardDescription>
        {formatEventDuration(durationInMinutes)}
      </CardDescription>
    </CardHeader>
    {description && (
      <CardContent className={cn(!isActive && "opacity-50")}>
        {description}
      </CardContent>
    )}
    <CardFooter className="flex justify-end gap-2 mt-auto">
      {isActive && (
        <CopyEventButton
          variant="outline"
          eventId={id}
          clerkUserId={clerkUserId}
        />
      )}
      <Button asChild>
        <Link href={`/events/${id}/edit`}>Edit</Link>
      </Button>
    </CardFooter>
  </Card>
);

export default EventsPage;
