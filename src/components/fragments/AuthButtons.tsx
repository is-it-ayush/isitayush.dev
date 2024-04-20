import { useToast } from "@src/lib/useToast";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@src/components/ui/Button";

export const AuthButtons = () => {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  return (
    <>
      {session.status !== "unauthenticated" ? (
        <Button
          tooltip="sign out."
          onClick={() => {
            (async () => {
              await signOut({ redirect: false });
              toast({
                title: "Success",
                description: "You have successfully signed out.",
              });
            })();
          }}>
          <span className="text-sm font-light">sign out.</span>
        </Button>
      ) : (
        <Button
          tooltip="sign in."
          onClick={() => {
            router.push(
              `/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`
            );
          }}>
          <span className="text-sm font-light">sign in.</span>
        </Button>
      )}
    </>
  );
};
