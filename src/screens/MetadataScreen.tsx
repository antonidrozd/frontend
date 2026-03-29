import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const metadataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Dataset title must be at least 5 characters."),
  description: z.string(),
  tags: z.array(z.string()),
});

type MetadataFormValues = z.infer<typeof metadataSchema>;

export function MetadataScreen() {
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MetadataFormValues>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const tags = watch("tags");

  function addTag(tag: string) {
    const nextTag = tag.trim();

    if (!nextTag || tags.includes(nextTag)) {
      return;
    }

    setValue("tags", [...tags, nextTag], {
      shouldValidate: true,
    });
    setTagInput("");
  }

  function removeTag(tagToRemove: string) {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
      {
        shouldValidate: true,
      },
    );
  }

  function onSubmit(data: MetadataFormValues) {
    console.log("Metadata form:", data);
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 ml-2 flex justify-center content-center">
            <h1
              className="text-primary [text-shadow:0_0_10px_rgba(0,200,255,0.8)] [filter:drop-shadow(0_0_0px_rgba(0,200,255,0.6))] text-4xl font-semibold uppercase tracking-widest"
            >
              Metadata
            </h1>
          </div>

          <Card
            className={cn(
              "border-border/60 bg-card/50 shadow-sm backdrop-blur transition-colors",
              "hover:border-primary/60 hover:bg-card/70",
            )}
          >
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Describe your dataset
              </CardTitle>
              <CardDescription className="max-w-2xl text-base sm:text-lg">
                Add the key information for your dataset so it is easier to
                understand, organize, and process later.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FieldGroup className="space-y-6">
                  <Field className="gap-2.5">
                    <FieldLabel className="text-sm font-medium">
                      Dataset title
                    </FieldLabel>
                    <Input
                      placeholder="Enter dataset title"
                      className={cn(
                        "h-12 rounded-xl border-border bg-input/70 transition-colors",
                        "hover:border-primary/50",
                        "focus-visible:ring-1 focus-visible:ring-ring",
                        errors.title &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                      {...register("title")}
                    />
                    <p className="text-sm text-muted-foreground">
                      Use a short, clear name that describes the dataset.
                    </p>
                    {errors.title && (
                      <p className="text-sm font-medium text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </Field>

                  <Field className="gap-2.5">
                    <FieldLabel className="text-sm font-medium">
                      Detailed description (optional)
                    </FieldLabel>
                    <textarea
                      placeholder="Add a short description"
                      rows={4}
                      className={cn(
                        "min-h-[140px] w-full rounded-xl border border-border bg-input/70 px-4 py-3 text-md text-foreground outline-none transition-colors placeholder:text-muted-foreground resize-none",
                        "hover:border-primary/50",
                        "focus:border-ring focus:ring-1 focus:ring-ring",
                      )}
                      {...register("description")}
                      onInput={(e) => {
                        e.currentTarget.style.height = "auto";
                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Briefly explain what the dataset contains and why it is
                      useful.
                    </p>
                  </Field>

                  <Field className="gap-2.5">
                    <FieldLabel className="text-sm font-medium">
                      Tags (optional)
                    </FieldLabel>
                    <Input
                      placeholder="Type a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className={cn(
                        "h-12 rounded-xl border-border bg-input/70 transition-colors",
                        "hover:border-primary/50",
                        "focus-visible:ring-1 focus-visible:ring-ring",
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                    />

                    <p className="text-sm text-muted-foreground">
                      Add keywords that make the dataset easier to find.
                    </p>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => removeTag(tag)}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm text-secondary-foreground transition-colors",
                              "hover:bg-secondary",
                            )}
                          >
                            <span>{tag}</span>
                            <span className="text-muted-foreground">×</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </Field>
                </FieldGroup>

                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="outline"
                    className="shadow-sm"
                  >
                    Confirm data
                    <ArrowRight />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
