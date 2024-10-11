"use client";

import { eventFormSchema } from "@/schema/events";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "../CustomFormField";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { createEvent } from "@/server/actions/events";
import { useState } from "react";

const EventForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      isActive: true,
      durationInMinutes: 30,
    },
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    setIsLoading(true);
    try {
      const data = await createEvent(values);

      if (data?.error) {
        form.setError("root", {
          message: "There was an error saving your event",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
          <Button disabled={isLoading} type="button" asChild variant="outline">
            <Link href="/events">Cancel</Link>
          </Button>
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
