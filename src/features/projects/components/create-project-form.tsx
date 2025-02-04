"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceId } from "@/features/workspaces/api/use-workspace-id";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../schema";

type FormSchema = z.infer<typeof createProjectSchema>;
export default function CreateProjectForm({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();

  const form = useForm<FormSchema>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    const payload = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: payload },
      {
        onSuccess() {
          form.reset();
        },
      }
    );
  };

  const onChangeUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue("image", file);
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <UploadImageInput
                    field={field}
                    isLoading={isPending}
                    onChangeUploadImage={onChangeUploadImage}
                  />
                )}
              />
            </div>
            <div
              className={cn("flex items-center mt-5", {
                "justify-between": onCancel,
                "justify-end": !onCancel,
              })}
            >
              {onCancel && (
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              )}
              <Button size="lg" disabled={isPending}>
                Create project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function UploadImageInput({
  field,
  isLoading,
  onChangeUploadImage,
}: {
  field: ControllerRenderProps<FormSchema>;
  isLoading: boolean;
  onChangeUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.[0])return;
    const file  = e.target.files[0];
    const fileSizeMB = file.size / (1024 * 1024);

    if(fileSizeMB > 1){
      toast.error("Max file size 1Mb")
      return;
    }

    onChangeUploadImage(e)
  }
  return (
    <div className="flex items-center gap-x-5">
      <div className="flex items-center gap-x-5">
        {field.value ? (
          <div className="size-[72px] relative rounded-md overflow-hidden">
            <Image
              className="object-cover"
              src={
                field.value instanceof File
                  ? URL.createObjectURL(field.value)
                  : field.value
              }
              alt="workspace"
              fill
            />
          </div>
        ) : (
          <Avatar className="size-[72px]">
            <AvatarFallback>
              <ImageIcon className="size-[36px] text-neutral-400" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-sm">Project Icon</p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG, SVG, or JPEG, max 1mb
        </p>
        <input
          type="file"
          className="hidden"
          accept=".jpg, .png, .jpeg, .svg"
          ref={inputRef}
          disabled={isLoading}
          onChange={onChange}
        />
        {field.value ? (
          <Button
            type="button"
            disabled={isLoading}
            size="xs"
            variant="destructive"
            className="w-fit mt-2"
            onClick={() => {
              if(!inputRef.current) return
              field.onChange(null);
              inputRef.current.value = "";
            }}
          >
            Remove Image
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isLoading}
            size="sm"
            variant="teritary"
            className="w-fit mt-2"
            onClick={() => inputRef.current?.click()}
          >
            Upload Image
          </Button>
        )}
      </div>
    </div>
  );
}
