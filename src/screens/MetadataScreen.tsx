import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
import { useUploadStore } from "@/store/uploadStore";

const metadataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Dataset title must be at least 5 characters."),
  description: z.string(),
  tags: z.array(z.string()),
});

type MetadataFormValues = z.infer<typeof metadataSchema>;

function decodeBase64Content(value: string) {
  if (!value) {
    return "";
  }

  try {
    const normalizedValue = value.replace(/\s+/g, "");

    if (!normalizedValue || normalizedValue.length % 4 !== 0) {
      return value;
    }

    const decoded = atob(normalizedValue);
    const bytes = Uint8Array.from(decoded, (character) =>
      character.charCodeAt(0),
    );

    return new TextDecoder().decode(bytes);
  } catch {
    return value;
  }
}

export function MetadataScreen() {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState("");
  const [editDataValue, setEditDataValue] = useState("");
  const uploadResponse = useUploadStore((state) => state.response);
  const setUploadResponse = useUploadStore((state) => state.setResponse);
  const editableTextFileTypes = new Set(["txt", "md", "csv"]);
  const fileType = uploadResponse?.fileType?.toLowerCase() ?? "";
  const isEditDataEnabled = editableTextFileTypes.has(fileType);

  useEffect(() => {
    console.log(uploadResponse);
  }, [uploadResponse]);

  useEffect(() => {
    const refinedContent = uploadResponse?.data.refined;

    if (!refinedContent || !isEditDataEnabled) {
      setEditDataValue("");
      return;
    }

    setEditDataValue(decodeBase64Content(refinedContent));
  }, [uploadResponse, isEditDataEnabled]);

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
    if (!uploadResponse) {
      console.log("Metadata form:", data);
      return;
    }

    const updatedResponse = {
      ...uploadResponse,
      data: {
        ...uploadResponse.data,
        refined: isEditDataEnabled ? editDataValue : uploadResponse.data.refined,
      },
      metadata: {
        title: data.title,
        description: data.description,
        tags: data.tags,
      },
    };

    setUploadResponse(updatedResponse);
    console.log("Updated upload response:", updatedResponse);
    navigate("/export");
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 ml-2 flex justify-center content-center">
            <h1 className="text-primary text-4xl font-semibold uppercase tracking-widest">
              Metadata
            </h1>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <Card
              className={cn(
                "border-border/60 bg-card/50 flex h-full flex-col shadow-sm backdrop-blur transition-colors",
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
                              <span className="text-muted-foreground">x</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "border-border/60 bg-card/50 flex h-full flex-col shadow-sm backdrop-blur transition-colors",
                "hover:border-primary/60 hover:bg-card/70",
              )}
            >
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Edit data
                </CardTitle>
                <CardDescription className="max-w-2xl text-base sm:text-lg">
                  {isEditDataEnabled
                    ? "Review and edit the content before continuing to the next step."
                    : "Editing is available only for .txt, .md, and .csv files."}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1">
                <Field className="flex flex-1 flex-col gap-3">
                  <FieldLabel className="text-sm font-medium">
                    Editable content
                  </FieldLabel>
                  <textarea
                    placeholder={
                      isEditDataEnabled
                        ? "Edit your dataset content here"
                        : "Editing is disabled for this file type"
                    }
                    value={editDataValue}
                    onChange={(e) => setEditDataValue(e.target.value)}
                    rows={18}
                    disabled={!isEditDataEnabled}
                    className={cn(
                      "min-h-[520px] w-full flex-1 rounded-xl border border-border bg-input/70 px-4 py-4 text-md text-foreground outline-none transition-colors placeholder:text-muted-foreground resize-none",
                      "hover:border-primary/50",
                      "focus:border-ring focus:ring-1 focus:ring-ring",
                      !isEditDataEnabled &&
                        "cursor-not-allowed opacity-60 hover:border-border",
                    )}
                  />
                </Field>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-8">
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="shadow-sm hover:border-primary"
              onClick={handleSubmit(onSubmit)}
            >
              Confirm data
              <ArrowRight />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
