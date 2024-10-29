import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useFetcher } from '@remix-run/react';
import { useId } from 'react';
import { initiateConnectionSchema } from '~/schemas/misc';

export default function ConnectWithUserForm({
  userId,
  targetUserId,
}: {
  userId: string | undefined;
  targetUserId: string;
}) {
  const fetcher = useFetcher({ key: 'connect-request' });

  const [form, fields] = useForm({
    id: useId(),
    constraint: getZodConstraint(initiateConnectionSchema),
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: initiateConnectionSchema });
    },
    defaultValue: {
      targetUserId,
      userId,
    },
  });
  return (
    <fetcher.Form {...getFormProps(form)} method="POST" action="/connection/request">
      <input {...getInputProps(fields.userId, { type: 'hidden' })} />
      <input {...getInputProps(fields.targetUserId, { type: 'hidden' })} />
      <button
        type="submit"
        className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-6 text-primary hover:text-primary-variant"
      >
        <PlusIcon aria-hidden="true" className="h-5 w-5 text-on-surface-variant" />
        Connect
      </button>
    </fetcher.Form>
  );
}
