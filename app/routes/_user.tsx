import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { Breadcrumb, Header } from '~/components';

export const handle = {
  breadcrumb: ({ params }: LoaderFunctionArgs) => {
    return <Breadcrumb name={params.username} to={params.username} />;
  },
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
