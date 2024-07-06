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

const loginSchema = z.object({
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
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(50, {
      message: "Password cannot be more then 50 characters",
    }),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    const response = await apiService.postWithoutToken(
      "/api/token",
      JSON.stringify({
        username: values.username,
        password: values.password,
      })
    );

    if (response.error) {
      console.log("Error: ", response.error);
    }

    if (response.access) {
      handleLogin(
        JSON.stringify({
          username: response.username,
          user_id: response.user_id,
          full_name: response.first_name,
        }),
        response.access,
        response.refresh
      );
    }

    setIsLoading(false);
  }

  return (
    <Card className="mt-20 mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onLoginSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
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
              Login
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
