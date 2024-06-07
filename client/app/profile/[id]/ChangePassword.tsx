"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/use-toast";
import { changePassword } from "@/services/auth/service";
import { UserDto } from "@/services/auth/dto";

const formSchema = z.object({
  password: z.string().min(7).max(50),
  confirmPassword: z.string().min(7).max(50),
});
// .superRefine((data, ctx) => {
//   if (data.password !== data.confirmPassword) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Passwords do not match.",
//       path: ["confirmPassword"],
//     });
//   }
// });
interface ChangePasswordProps {
  user: UserDto;
}
const ChangePassword = ({ user }: ChangePasswordProps) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newPassword = {
        password1: values.password,
        password2: values.confirmPassword,
      };
      const res = await changePassword(
        values.password,
        values.confirmPassword,
        user.accessToken
      );
      toast({
        title: "Change password success!",
        description: `Welcome!`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Sign up failed!",
        description: error?.toString(),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="">
          <CardHeader className="items-center">
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent className="px-auto flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-center">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ChangePassword;
