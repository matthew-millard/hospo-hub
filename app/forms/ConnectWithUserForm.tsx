import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useFetcher, useRouteLoaderData } from '@remix-run/react';
import { useId } from 'react';
import { loader } from '~/root';
import { connectionSchema } from '~/schemas/misc';

export const initiateConnectionActionIntent = 'initiate-connection';
export const cancelConnectionActionIntent = 'cancel-connection';
export const acceptConnectionActionIntent = 'accept-connection';
export const declineConnectionActionIntent = 'decline-connection';

export default function ConnectWithUserForm({
  userId,
  targetUserId,
}: {
  userId: string | undefined;
  targetUserId: string;
}) {
  const data = useRouteLoaderData<typeof loader>('root');
  const hasSentRequest = data?.user?.connections?.some(connection => connection.targetUserId === targetUserId);
  const hasReceivedRequest = data?.user?.receivedConnections?.some(connection => connection.userId === targetUserId);

  const fetcher = useFetcher({ key: 'connect-request' });

  const [form, fields] = useForm({
    id: useId(),
    constraint: getZodConstraint(connectionSchema),
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: connectionSchema });
    },
    defaultValue: {
      targetUserId,
      userId,
    },
  });
  return (
    <fetcher.Form {...getFormProps(form)} method="POST" action={`/${data?.user?.username}/connections`}>
      <input {...getInputProps(fields.userId, { type: 'hidden' })} />
      <input {...getInputProps(fields.targetUserId, { type: 'hidden' })} />
      {hasReceivedRequest ? (
        <div className="flex gap-4 text-on-surface-variant">
          <button
            name="intent"
            value={acceptConnectionActionIntent}
            type="submit"
            className="inline-flex  items-center gap-x-1.5 text-sm font-semibold leading-6 text-primary hover:text-primary-variant"
          >
            Accept
          </button>
          /{' '}
          <button
            name="intent"
            value={declineConnectionActionIntent}
            type="submit"
            className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-6 text-zinc-400 hover:text-zinc-500 dark:text-zinc-700 dark:hover:text-zinc-600"
          >
            Decline
          </button>
        </div>
      ) : hasSentRequest ? (
        <button
          name="intent"
          value={cancelConnectionActionIntent}
          type="submit"
          className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-6 text-dodger-blue-300 dark:text-dodger-blue-700"
        >
          <MinusIcon aria-hidden="true" className="h-5 w-5 text-zinc-300 dark:text-zinc-700" />
          Request sent
        </button>
      ) : (
        <button
          name="intent"
          value={initiateConnectionActionIntent}
          type="submit"
          className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-6 text-primary hover:text-primary-variant"
        >
          <PlusIcon aria-hidden="true" className="h-5 w-5 text-on-surface-variant" />
          Connect
        </button>
      )}
    </fetcher.Form>
  );
}
