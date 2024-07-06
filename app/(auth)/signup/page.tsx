"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import apiService from "@/lib/api";
import { handleLogin } from "@/lib/actions";
import { toast } from "sonner";

const signupSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(20, {
      message: "Username cannot be more then 20 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username can only contain letters and numbers",
    }),
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters",
    })
    .max(50, {
      message: "Name cannot be more then 50 characters",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(50, {
      message: "Password cannot be more then 50 characters",
    }),
});

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      name: "",
      password: "",
    },
  });

  async function onSignUpSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    const response = await apiService.postWithoutToken(
      "/api/user/register/",
      JSON.stringify({
        username: values.username,
        first_name: values.name,
        password: values.password,
      })
    );

    if (response.error) {
      console.log("Error: ", response.error);
      toast.error(response.error.message.detail);
    } else {
      const resp = await apiService.postWithoutToken(
        "/api/token",
        JSON.stringify({
          username: values.username,
          password: values.password,
        })
      );

      if (resp.error) {
        console.log("Access token: ", resp.error);
        toast.error(resp.error.message.detail);
      } else {
        handleLogin(
          JSON.stringify({
            username: resp.username,
            user_id: resp.user_id,
            full_name: resp.first_name,
          }),
          resp.access,
          resp.refresh
        );
      }
    }

    setIsLoading(false);
  }

  return (
    <Card className="mt-20 mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSignUpSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Select your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#465FF1] hover:bg-[#4D47CE]"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
