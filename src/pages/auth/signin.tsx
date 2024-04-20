import { Page } from '@src/components/ui/Page';
import { Github, Twitter } from 'lucide-react';
import { getProviders, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useToast } from '@src/lib/useToast';
import { Button } from '@src/components/ui/Button';

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};
type Providers = Record<string, Provider>;

const providerIcon: Record<string, ReactNode> = {
  github: <Github className="w-6 h-6" />,
  twitter: <Twitter className="w-6 h-6" />,
};

const SignIn = () => {
  const [providers, setProviders] = useState<Providers | null>(null);
  const params = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const providers = await getProviders();
      setProviders(providers);
    })();
  }, []);

  async function handleSignInFromProvider(provider: string) {
    try {
      await signIn(provider, {
        callbackUrl: params.get('callbackUrl') ?? '',
        redirect: false,
      });
      toast({
        title: 'Success',
        description: `You have successfully signed in with ${provider}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: `Failed to sign in with ${provider}`,
        variant: 'destructive',
      });
    }
  }

  return (
    <Page>
      <div className="flex flex-row items-center justify-center gap-6 h-full">
        <span className="text-4xl font-medium">signin.</span>
        <span className="bg-black/95 dark:bg-white/95 h-16 w-1" />
        <div className="flex flex-row gap-4">
          {Object.values(providers ?? {}).map((provider) => (
            <Button
              tooltip={`sign in with ${provider.name}.`}
              key={provider.id}
              onClick={() => handleSignInFromProvider(provider.id)}
              className=""
            >
              <div className="flex items-center gap-2 p-4">
                {providerIcon[provider.id]}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Page>
  );
};

export default SignIn;
