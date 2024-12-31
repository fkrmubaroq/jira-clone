"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { createWorkspaceSchema } from "../schemas";

type FormSchema = z.infer<typeof createWorkspaceSchema>
export default function CreateWorkspaceForm() {
    const { mutate, isPending } = useCreateWorkspace();

    const form = useForm<FormSchema>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: ""
        }
    });

    const onSubmit = (values: FormSchema) => {
        console.log({ values });
        mutate({ json: values })
    }

    const onCancel = () => {

    }

    return <Card className="size-full border-none shadow-none">
        <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
                Create a new workspace
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
                                    <FormLabel>Workspace</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-5">
                        <Button
                            type="button"
                            size="lg"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="lg"
                            onClick={onCancel}
                            disabled={isPending}
                        >
                            Create Workspace
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>

}