import { eventFormSchema } from "@/schema/events";
import { ReactElement } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { z } from "zod";

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  type?: "input" | "textarea" | "switch" | "number";
}

const CustomFormField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  type = "input",
}: CustomFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
            {type === "switch" && (
              <Switch
                className="mr-2"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl>
            {type === "textarea" ? (
              <Textarea {...field} className="resize-none h-32" />
            ) : (
              type !== "switch" && (
                <Input
                  {...field}
                  type={type === "number" ? "number" : "text"}
                />
              )
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
