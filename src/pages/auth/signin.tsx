import { Page } from '@src/components/ui/Page';
import { Github, Twitter } from 'lucide-react';
import { getProviders, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useToast } from '@src/lib/useToast';
import { Button } from '@src/components/ui/Button';
import type { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from '@src/server/auth';

// using my own type for providers since inferring via InferGetServerSidePropsType does not work.
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

// https://next-auth.js.org/configuration/pages#sign-in-page
const errorCodeMap: Record<string, string> = {
  OAuthSignin: 'There was an error signing in with OAuth provider.',
  OAuthCallback: 'There was an error in handling the OAuth callback.',
  OAuthCreateAccount:
    'There was an error creating an account with OAuth provider.',
  EmailCreateAccount: 'There was an error creating an account with email.',
  Callback: 'There was an error in handling the callback.',
  OAuthAccountNotLinked: 'There was an error in linking the OAuth account.',
  EmailSignin: 'There was an error signing in with email.',
  CredentialsSignin: 'There was an error signing in with credentials.',
  SessionRequired: 'A session is required to access this page.',
};

interface SignInProps {
  providers: Providers;
}

const SignIn = ({ providers }: SignInProps) => {
  const params = useSearchParams();
  const { toast } = useToast();

  async function handleSignInFromProvider(provider: string) {
    await signIn(provider, {
      callbackUrl: params.get('callbackUrl') ?? '',
    });
    toast({
      title: 'Success',
      description: `You've signed in with ${provider}`,
    });
  }

  return (
    <Page>
      <div className="flex flex-row items-center justify-center gap-6 h-full">
        <span className="text-4xl font-medium">signin.</span>
        <span className="bg-black/95 dark:bg-white/95 h-16 w-1" />
        <div className="flex flex-row gap-4">
          {Object.values(providers).map((provider) => (
            <Button
              tooltip={`sign in with ${provider.name}.`}
              key={provider.id}
              onClick={() => handleSignInFromProvider(provider.id)}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  // if there is a session, redirect to callbackUrl or root page
  if (session) {
    return {
      redirect: {
        destination: context.query?.callbackUrl ?? '/',
        permanent: false,
      },
    };
  }
  // if there is an error, redirect to 500 page with error message
  if (context.query?.error) {
    return {
      redirect: {
        destination: `/500?error=${errorCodeMap[context.query.error.toString()]}`,
        permanent: false,
      },
    };
  }
  // if there is no session, get providers
  const providers = await getProviders();
  return {
    props: {
      providers: providers ?? {},
    },
  };
}

export default SignIn;
