import { Links, Meta, Outlet, redirect, Scripts, ScrollRestoration, useLoaderData, useMatches } from '@remix-run/react';
import { json, LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import styles from '~/tailwind.css?url';
import honeypot, { checkHoneypot } from './.server/honeypot';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import { checkCSRF, csrf } from '~/.server/csrf';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { getThemeFromCookie, updateTheme } from './.server/theme';
import { Theme } from './components/ThemeSwitcher';
import { useTheme } from './hooks';
import { getUserId } from './.server/auth';
import { getPeopleYouMayKnow, getUserData } from './.server/utils';
import { GenericErrorBoundary, Toast } from './components';
import { getToast, toastSessionStorage } from './.server/toast';
import { combineHeaders } from './utils/misc';
import { toast as showToast, Toaster } from 'sonner';
import { useEffect } from 'react';
import { ToastProps } from './components/Toast';
import { ExternalScripts } from 'remix-utils/external-scripts';

export const updateThemeActionIntent = 'update-theme';

export type ContextType = {
  theme: Theme;
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles, as: 'style' }];
};

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  await checkCSRF(formData, request.headers);
  checkHoneypot(formData);
  const intent = formData.get('intent') as string;

  switch (intent) {
    case updateThemeActionIntent:
      return updateTheme(formData);
    default:
      return json({ status: 'error', message: 'Invalid intent' }, { status: 400 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request);
  const theme = getThemeFromCookie(request);
  const userId = await getUserId(request);
  const { toast, toastCookieSession } = await getToast(request);

  const user = userId ? await getUserData(userId) : null;

  // get all other users within the same city

  const peopleYouMayKnow = await getPeopleYouMayKnow(userId, user?.location?.placeId);

  const data = {
    csrfToken,
    honeypotInputProps: honeypot.getInputProps(),
    theme: theme as Theme,
    toast,
    user,
    peopleYouMayKnow,
  };

  const combinedHeader = combineHeaders(
    csrfCookieHeader
      ? {
          'set-cookie': csrfCookieHeader,
        }
      : null,
    {
      'set-cookie': await toastSessionStorage.commitSession(toastCookieSession),
    }
  );

  return json(data, {
    headers: combinedHeader,
  });
}

function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <Document>
      <Outlet />
      {data.toast ? <ShowToast toast={data.toast} /> : null}
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <html lang="en" className={`${theme} h-full`}>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background h-full">
        {children}
        <Toaster />
        <ScrollRestoration />
        <ExternalScripts />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const { honeypotInputProps, csrfToken } = useLoaderData<typeof loader>();
  return (
    <AuthenticityTokenProvider token={csrfToken}>
      <HoneypotProvider {...honeypotInputProps}>
        <App />
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <GenericErrorBoundary />
    </Document>
  );
}

function ShowToast({ toast }: { toast: ToastProps }) {
  const { type, title, description, id } = toast;

  useEffect(() => {
    setTimeout(() => {
      showToast.custom(t => <Toast id={id} type={type} title={title} description={description} />);
    }, 0);
  }, [type, title, description, id]);
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Hospo Hub' },
    {
      name: 'description',
      content:
        'Hospo Hub is the go-to professional networking platform for hospitality workers. Connect with industry peers, showcase your experience, and discover new opportunities in the hospitality sector.',
    },
    { property: 'og:title', content: 'Hospo Hub' },
    {
      property: 'og:description',
      content:
        'Hospo Hub is the go-to professional networking platform for hospitality workers. Connect with industry peers, showcase your experience, and discover new opportunities in the hospitality sector.',
    },
    { property: 'og:url', content: 'https://Hospohub.com' },
  ];
};
