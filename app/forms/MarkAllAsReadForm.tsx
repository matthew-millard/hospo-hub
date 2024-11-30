import { useFetcher, useRouteLoaderData } from '@remix-run/react';
import { loader } from '~/root';

export const markAllAsReadActionIntent = 'mark-all-as-read';

export default function MarkAllAsReadForm() {
  const data = useRouteLoaderData<typeof loader>('root');
  const fetcher = useFetcher({ key: markAllAsReadActionIntent });

  return (
    <fetcher.Form method="POST" action={`/${data?.user?.username}`} id={markAllAsReadActionIntent}>
      <input type="hidden" name="userId" defaultValue={data?.user?.id} />
      <button
        type="submit"
        name="intent"
        value={markAllAsReadActionIntent}
        className="text-on-surface-variant hover:text-zinc-400 dark:hover:text-zinc-600 text-xs font-medium"
        aria-label="Mark all as read"
      >
        Mark all as read
      </button>
    </fetcher.Form>
  );
}
