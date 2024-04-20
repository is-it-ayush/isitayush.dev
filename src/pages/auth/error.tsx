import { Button } from "@src/components/ui/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export const Error = () => {
  const params = useSearchParams();
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-center gap-4 max-w-lg">
      <span className="text-4xl font-medium text-red-800 dark:text-red-100">
        something went wrong.
      </span>
      <span className="text-sm font-light">
        {params.get("error") ??
          "There was an error processing the request. Could you try again?"}
      </span>
      <Button
        tooltip="go home."
        onClick={() => {
          router.push("/");
        }}
        className="text-sm font-light underline">
        go home.
      </Button>
    </div>
  );
};

export default Error;
