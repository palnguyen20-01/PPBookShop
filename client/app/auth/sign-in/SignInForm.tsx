"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignInRequestDto } from "@/services/auth/dto";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_CARTS } from "@/services/carts/queries";

import { useEffect } from "react";
import { writeToLocalStorageWithoutStringify } from "@/lib/localStorage";
interface Props {
  callbackUrl?: string;
}

const formSchema = z.object({
  emailOrUsername: z
    .string()
    .email("Invalid email address")
    .or(
      z.string().min(5, { message: "Username must be at least 3 characters" })
    )
    .refine(
      (value) => {
        return !value.includes(" ");
      },
      { message: "Username cannot contain spaces" }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const SignInForm = ({ callbackUrl }: Props) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [getCart, { data, loading, error }] = useLazyQuery(GET_CARTS);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  useEffect(() => {
    async function fetchCart() {
      if (session?.user.id) {
        const cart = await getCart({
          variables: {
            UserID: session?.user.id,
          },
        });
        if (
          cart &&
          cart.data &&
          cart.data.getCart &&
          cart.data.getCart.CartDetail &&
          cart.data.getCart.CartDetail.length > 0 &&
          session?.user.id
        ) {
          writeToLocalStorageWithoutStringify(
            session?.user.id,
            cart.data.getCart.CartDetail
          );
        }
      }
    }
    fetchCart();
  }, [session?.user.id]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await signIn("credentials", {
      emailOrUsername: values.emailOrUsername,
      password: values.password,
      redirect: false,
    });
    if (!result?.ok) {
      toast({
        title: "Login failed!",
        description: result?.error,
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Login successful!",
      description: "You have been successfully logged in",
      duration: 3000,
      variant: "success",
    });

    router.push(callbackUrl ? callbackUrl : "/");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email or username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignInForm;
