import { Button } from '@src/components/ui/Button';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

// https://next-auth.js.org/configuration/pages#error-page
const errorCodeMap: Record<string, string> = {
  Configuration: 'There was an error in the configuration.',
  AccessDenied: 'Access was denied.',
  Verification: 'There was an error verifying the request.',
};

export const Error = () => {
  const params = useSearchParams();
  const router = useRouter();

  function processError(): string {
    const error = params.get('error');
    if (error) {
      return Object.keys(errorCodeMap).includes(error)
        ? errorCodeMap[error]
        : error;
    } else {
      return 'There was an error processing the request. Could you try again?';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-center gap-4 max-w-lg">
      <span className="text-4xl font-medium text-red-800 dark:text-red-100">
        500 : something went wrong.
      </span>
      <span className="text-sm font-light">{processError()}</span>
      <Button
        tooltip="go home."
        onClick={() => {
          router.push('/');
        }}
        className="text-sm font-light underline"
      >
        go home.
      </Button>
    </div>
  );
};

export default Error;
