"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  formatDate,
  formatTimeString,
  formatTimezoneOffset,
} from "@/lib/formatters";
import { meetingFormSchema } from "@/schema/meetings";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useMemo } from "react";
import { toZonedTime } from "date-fns-tz";
import CustomFormField from "../CustomFormField";
import { createMeeting } from "@/server/actions/meetings";

const MeetingForm = ({
  calendarUser,
  validTimes,
  eventId,
  clerkUserId,
}: {
  calendarUser: string | null;
  validTimes: Date[];
  eventId: string;
  clerkUserId: string;
}) => {
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const timezone = form.watch("timezone");
  const date = form.watch("date");

  const validTimesInTimezone = useMemo(() => {
    return validTimes.map((date) => toZonedTime(date, timezone));
  }, [validTimes, timezone]);

  const onSubmit = async (values: z.infer<typeof meetingFormSchema>) => {
    try {
      const data = await createMeeting({ ...values, eventId, clerkUserId });

      if (data?.error) {
        form.setError("root", {
          message: "There was an error saving your event",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Timezone</FormLabel>
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Intl.supportedValuesOf("timeZone").map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                      {` (${formatTimezoneOffset(timezone)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <Popover>
                <FormItem className="flex-1">
                  <FormLabel>Date</FormLabel>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal flex w-full",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Pick a Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        !validTimesInTimezone.some((time) =>
                          isSameDay(date, time)
                        )
                      }
                    />
                  </PopoverContent>
                  <FormMessage />
                </FormItem>
              </Popover>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Date</FormLabel>

                <Select
                  disabled={date == null || timezone == null}
                  onValueChange={(value) =>
                    field.onChange(new Date(Date.parse(value)))
                  }
                  defaultValue={field.value?.toISOString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          date == null || timezone == null
                            ? "Select a date/timezone first"
                            : "Select meeting time"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {validTimesInTimezone
                      .filter((time) => isSameDay(time, date))
                      .map((time) => (
                        <SelectItem
                          key={time.toISOString()}
                          value={time.toISOString()}
                        >
                          {formatTimeString(time)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <CustomFormField
          control={form.control}
          name="guestName"
          label="Your Name"
        />
        <CustomFormField
          control={form.control}
          name="guestEmail"
          label="Your Email"
          type="email"
        />

        <CustomFormField
          control={form.control}
          name="guestNotes"
          label="Notes"
          description={`Optional details you want ${calendarUser} to know`}
          type="textarea"
        />

        <div className="flex gap-2 justify-end">
          <Button
            disabled={form.formState.isSubmitting}
            type="button"
            asChild
            variant="outline"
          >
            <Link href={`/book/${clerkUserId}`}>Cancel</Link>
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Scheduling" : "Schedule"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MeetingForm;
