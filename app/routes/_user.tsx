import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { ExternalScriptsFunction } from 'remix-utils/external-scripts';
import { Breadcrumb, Header } from '~/components';

export async function loader() {
  return {
    googleApiKey: process.env.GOOGLE_API_KEY,
  };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

const scripts: ExternalScriptsFunction<LoaderData> = ({ data }) => {
  const googleApiKey = data.googleApiKey;
  if (!googleApiKey) return [];

  return [
    {
      src: `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`,
      async: true,
    },
  ];
};

export const handle = {
  breadcrumb: ({ params }: LoaderFunctionArgs) => {
    return <Breadcrumb name={params.username} to={params.username} />;
  },
  scripts,
};

export default function UserLayoutRoute() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <main className="py-10 max-w-screen-xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
