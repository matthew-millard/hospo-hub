import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useFetcher } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { FormErrors, FormFieldErrors, SubmitButton } from '~/components';
import { publicEndorsementSchema } from '~/schemas/misc';

export const publicEndorsementActionIntent = 'public-endorsement';

export default function PublicEndorsementForm({ endorsedUserId }: { endorsedUserId: string | undefined }) {
  const fetcher = useFetcher({ key: publicEndorsementActionIntent });
  const isPending = fetcher.state !== 'idle' && fetcher.formData?.get('intent') === publicEndorsementActionIntent;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher?.data?.status === 'success') {
      formRef.current?.reset();
    }
  }, [fetcher.state]);

  const [form, fields] = useForm({
    id: 'public-endorsement-form',
    constraint: getZodConstraint(publicEndorsementSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: publicEndorsementSchema });
    },
    defaultValue: {
      body: '',
      endorsedUserId,
    },
  });

  return (
    <fetcher.Form method="POST" {...getFormProps(form)} preventScrollReset ref={formRef}>
      <input {...getInputProps(fields.endorsedUserId, { type: 'hidden' })} />
      <div>
        <label htmlFor={fields.body.id} className="sr-only">
          Public Endorsement
        </label>
        <textarea
          {...getTextareaProps(fields.body)}
          rows={3}
          placeholder="Leave a public endorsement..."
          className="block w-full text-on-surface rounded-md border-0 py-1.5 pl-3 shadow-sm bg-surface ring-1 ring-inset ring-around-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
        />
      </div>
      <div className="mt-3 flex justify-between">
        <div>
          {fields.body.errors && (
            <div>
              <FormFieldErrors field={fields.body} />
            </div>
          )}
          {form.errors && (
            <div>
              <FormErrors errorId={form.errorId} errors={form.errors} />
            </div>
          )}
        </div>

        <div>
          <SubmitButton
            fieldAttributes={{ form: form.id, name: 'intent', value: publicEndorsementActionIntent }}
            text="Post"
            isPending={isPending}
            pendingText="Posting..."
          />
        </div>
      </div>
    </fetcher.Form>
  );
}
