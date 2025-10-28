import { useTranslation } from "react-i18next";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAuthActions from "@/utils/hooks/authActions";

const Logout = () => {
  const { t } = useTranslation("");
  const { handleLogout } = useAuthActions();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<string | null>(null);

  const logoutButton = t("logout.logoutBtn");
  const successMessage = t("logout.success");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await handleLogout();

    if (result?.isError) {
      setIsSuccess(null);

      if (result?.message) {
        setIsError(result.message);
      } else {
        setIsError(t("error.logoutFailed"));
      }
    } else {
      setIsError(null);
      setIsSuccess(successMessage);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Button
          type="submit"
          className="w-full bg-white font-medium text-slate-950 hover:bg-slate-100"
          disabled={isLoading}
        >
          {logoutButton}{" "}
          {isLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
          )}
        </Button>

        {isError && (
          <Label className="my-4 flex justify-center align-middle text-red-700">
            {isError}
          </Label>
        )}

        {isSuccess && (
          <Label className="my-4 flex justify-center align-middle text-green-700">
            {isSuccess}
          </Label>
        )}
      </form>
    </div>
  );
};

export default Logout;
