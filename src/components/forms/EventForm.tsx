"use client";

import { eventFormSchema } from "@/schema/events";
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events";
import { zodResolver } from "@hookform/resolvers/zod";
import {} from "@radix-ui/react-alert-dialog";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "../CustomFormField";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const EventForm = ({
  event,
}: {
  event?: {
    id: string;
    name: string;
    description?: string;
    durationInMinutes: number;
    isActive: boolean;
  };
}) => {
  const [isDeletePending, startDeletion] = useTransition();
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ?? {
      isActive: true,
      durationInMinutes: 30,
    },
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    const action =
      event == null ? createEvent : updateEvent.bind(null, event.id);

    try {
      const data = await action(values);

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
        <CustomFormField
          control={form.control}
          name="name"
          label="Event Name"
          description="The name of your event. Users will see this when booking it"
        />
        <CustomFormField
          control={form.control}
          name="durationInMinutes"
          label="Duration"
          description="In minutes"
          type="number"
        />
        <CustomFormField
          control={form.control}
          name="description"
          label="Description"
          description="Optional description of the event"
          type="textarea"
        />
        <CustomFormField
          control={form.control}
          name="isActive"
          label="Active"
          description="Inactive events will not be visible"
          type="switch"
        />

        <div className="flex gap-2 justify-end">
          {event && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={form.formState.isSubmitting || isDeletePending}
                  type="button"
                  variant={"destructiveGhost"}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This cannot be undone, it will delete your event forever.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={form.formState.isSubmitting || isDeletePending}
                    variant="destructive"
                    onClick={() => {
                      startDeletion(async () => {
                        const data = await deleteEvent(event.id);

                        if (data?.error) {
                          form.setError("root", {
                            message: "There was an error deleting your event",
                          });
                        }
                      });
                    }}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            disabled={form.formState.isSubmitting}
            type="button"
            asChild
            variant="outline"
          >
            <Link href="/events">Cancel</Link>
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
