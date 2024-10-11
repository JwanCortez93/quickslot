"use client";

import { eventFormSchema } from "@/schema/events";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "../CustomFormField";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const EventForm = () => {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      isActive: true,
      durationInMinutes: 30,
    },
  });

  const onSubmit = (values: z.infer<typeof eventFormSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
          <Button type="button" asChild variant="outline">
            <Link href="/events">Cancel</Link>
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
