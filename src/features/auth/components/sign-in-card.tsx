"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { useLogin } from "../api/use-login";
import { loginSchema } from "../schema";

type FormSchema = z.infer<typeof loginSchema>;
export function SignInCard() {
  const { mutate: mutateLogin } = useLogin()

  const form = useForm<FormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: FormSchema) => {
    mutateLogin({ json: data });
  }


  return (
    <>
      <Card className="h-full w-full md:w-[487px] border-none shadow-none min-w-[27.75rem]">
        <CardHeader className="flex items-center justify-center text-center p-7">
          <CardTitle className="text-2xl">Welcome back!</CardTitle>
        </CardHeader>
        <CardContent className="p-7">
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >

              <FormField
                name="email"
                control={form.control}
                render={({ field, formState: { errors: { email } } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        error={!!email}
                        {...field}
                        type="email"
                        placeholder="Enter email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field, formState: { errors: { password } } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        error={!!password}
                        type="password"
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button size="lg" className="w-full" >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <LineSeparator text="Or" />
        <CardContent className="p-7 flex flex-col gap-y-4">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
          >
            <FcGoogle />
            Login with Google
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
          >
            <FaGithub />
            Login with Github
          </Button>
        </CardContent>

        <LineSeparator />

        <CardContent className="p-7 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account? <Link className="text-blue-700" href="/sign-up">Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </>
  )
}

function LineSeparator({ text }: { text?: string }) {
  return <div className="px-7">
    {text ? <div className="flex items-center">
      <Separator className="!w-1/2 !shrink" />
      <span className="text-sm text-muted-foreground px-4">{text}</span>
      <Separator className="!w-1/2 !shrink" />
    </div> :
      <Separator />
    }
  </div>

}