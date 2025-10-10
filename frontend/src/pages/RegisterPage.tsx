import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  first_name: z.string({ error: "First name is required" }),
  last_name: z.string({ error: "Last name is required" }),
  email: z.email({ error: "Invalid email format" }),
  password: z.string().min(8, { error: "Password must be at least 8 characters long" }),
});

type RegisterFormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
  });

  const { registerUser } = useAuthStore();

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
  };

  return (
    <div className="flex sm:min-h-[600px] items-center justify-center py-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <Link to="/" className="flex flex-col items-center gap-2 sm:flex-row">
              <Car className="size-8 text-primary" />
              <span className="text-2xl font-bold">Vehicle Marketplace</span>
            </Link>
          </div>
          <CardTitle className="font-bold text-xl">Create an account</CardTitle>
          <CardDescription>Join thousands of buyers and sellers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <InputGroup>
                  <InputGroupInput id="first_name" placeholder="John" {...register("first_name")} />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                </InputGroup>
                {errors.first_name && (
                  <span className="text-sm text-red-500">{errors.first_name.message}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input id="last_name" placeholder="Doe" {...register("last_name")} />
                {errors.last_name && (
                  <span className="text-sm text-red-500">{errors.last_name.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password.message}</span>
              )}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 my-2" size="lg">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
