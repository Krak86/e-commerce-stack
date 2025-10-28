import { useTranslation } from "react-i18next";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/utils/static/routes";
import useAuthActions from "@/utils/hooks/authActions";

const Login = () => {
  const { t } = useTranslation("");
  const { lang } = useParams<"lang">();
  const { handleLogin, handleRedirect } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const emailTitle = t("login.email");
  const passwordTitle = t("login.password");
  const loginButton = t("login.loginBtn");
  const signUpText = t("login.dontHaveAccount");
  const signUpLinkText = t("login.signUpLink");

  const registerUrl = `/${lang}/${routes.register}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await handleLogin(email, password);

    if (!!result?.message && !!result?.isError) {
      setIsError(result.message);
    } else {
      setIsError(null);
    }
    // setIsLoading(false);

    handleRedirect();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-200">
            {emailTitle}
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-slate-700 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-slate-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-200">
            {passwordTitle}
          </Label>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-slate-700 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-slate-500"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-white font-medium text-slate-950 hover:bg-slate-100"
          disabled={isLoading}
        >
          {loginButton}{" "}
          {isLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
          )}
        </Button>

        {isError && (
          <Label className="my-4 flex justify-center align-middle text-red-700">
            {isError}
          </Label>
        )}

        <p className="flex justify-center gap-2 text-center text-sm text-slate-400">
          {signUpText}
          <a
            href={registerUrl}
            className="font-medium text-white hover:underline"
          >
            {signUpLinkText}
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
