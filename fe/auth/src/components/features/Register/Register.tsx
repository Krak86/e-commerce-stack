import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { routes } from "@/utils/static/routes";
import useAuthActions from "@/utils/hooks/authActions";

const Register = () => {
  const { t } = useTranslation("");
  const { handleRegister, handleRedirect } = useAuthActions();
  const { lang } = useParams<"lang">();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const nameTitle = t("register.name");
  const emailTitle = t("register.email");
  const namePlaceholder = t("register.namePlaceholder");
  const passwordTitle = t("register.password");
  const registerButton = t("register.registerBtn");
  const signInText = t("register.haveAccount");
  const signInLinkText = t("register.loginLink");

  const loginUrl = `/${lang}/${routes.login}`;

  const formSchema = z.object({
    name: z.string().min(1, t("error.invalidName")),
    email: z.email(t("error.invalidEmail")),
    password: z.string().min(6, t("error.invalidPassword")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const result = await handleRegister(data.name, data.email, data.password);

    if (result?.message && result?.isError) {
      setIsError(result.message);
    } else {
      setIsError(null);
    }
    // setIsLoading(false);

    handleRedirect();
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  <Label htmlFor="name" className="text-slate-200">
                    {nameTitle}
                  </Label>
                </FieldLabel>

                <FieldDescription>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder={namePlaceholder}
                    className="border-slate-700 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-slate-500"
                  />
                </FieldDescription>

                <FieldError>
                  {fieldState.error && (
                    <p className="text-sm text-red-400">
                      {fieldState.error.message}
                    </p>
                  )}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  <Label htmlFor="email" className="text-slate-200">
                    {emailTitle}
                  </Label>
                </FieldLabel>

                <FieldDescription>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="border-slate-700 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-slate-500"
                  />
                </FieldDescription>

                <FieldError>
                  {fieldState.error && (
                    <p className="text-sm text-red-400">
                      {fieldState.error.message}
                    </p>
                  )}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  <Label htmlFor="password" className="text-slate-200">
                    {passwordTitle}
                  </Label>
                </FieldLabel>
                <FieldDescription>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="border-slate-700 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-slate-500"
                  />
                </FieldDescription>
                <FieldError>
                  {fieldState.error && (
                    <p className="text-sm text-red-400">
                      {fieldState.error.message}
                    </p>
                  )}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>

        <Field>
          <Button
            type="submit"
            className="w-full bg-white font-medium text-slate-950 hover:bg-slate-100"
            disabled={isLoading}
          >
            {registerButton}{" "}
            {isLoading && (
              <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
            )}
          </Button>
        </Field>

        {isError && (
          <Label className="my-4 flex justify-center align-middle text-red-700">
            {isError}
          </Label>
        )}

        <p className="text-center text-sm text-slate-400">
          {signInText}{" "}
          <a href={loginUrl} className="font-medium text-white hover:underline">
            {signInLinkText}
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
