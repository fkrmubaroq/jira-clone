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
import ModalConfirmation from "@/features/workspaces/components/modal-confirmation";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { useDeleteProject } from "../api/use-delete-project";
import { useUpdateProject } from "../api/use-update-project";
import { updateProjectSchema } from "../schema";
import { Project } from "../types";


type FormSchema = z.infer<typeof updateProjectSchema>;
export default function EditProjectForm({
  onCancel,
  initialValues,
}: {
  onCancel?: () => void;
  initialValues: Project;
}) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { show, showModal, modalName, hideModal } = useModal<
    "confirmation-delete" | "reset-invite-code"
  >();
  const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();

  const form = useForm<FormSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl || "",
    },
  });

  const handleDelete = async () => {
    deleteProject(
      {
        param: {
          projectId: initialValues.$id,
        },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${initialValues.workspaceId}`);
        },
      }
    );
  };


  const onSubmit = (values: FormSchema) => {
    const payload = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      {
        form: payload,
        param: { projectId: initialValues.$id },
      },
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
    <>
      {show && (
        <>
          {modalName === "confirmation-delete" && (
            <ModalConfirmation
              show={show}
              onHide={hideModal}
              onConfirm={handleDelete}
              title="Delete Project"
              message="This action cannot be undone"
              variant="destructive"
              isLoading={isDeletingProject}
            />
          )}
        </>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={
          onCancel
            ? onCancel
            : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)
        }
      >
        <ArrowLeftIcon />
        Back
      </Button>
      <div className="flex flex-col gap-y-4">
        <Card className="size-full border-none shadow-none mt-2">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <CardTitle className="text-xl font-bold">
              {initialValues.name}
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
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <CardDangerZone
          isLoading={isPending}
          onClick={() => showModal("confirmation-delete")}
        />

      </div>
    </>
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
          onChange={onChangeUploadImage}
        />
        {field.value ? (
          <Button
            type="button"
            disabled={isLoading}
            size="xs"
            variant="destructive"
            className="w-fit mt-2"
            onClick={() => {
              if (!inputRef.current) return;
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

function CardDangerZone({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting a project is irreversible and will remove all associated
            data.
          </p>
          <Button
            className="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isLoading}
            onClick={onClick}
          >
            Delete Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

