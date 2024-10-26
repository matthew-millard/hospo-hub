import { getFormProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useFetcher, useFetchers } from '@remix-run/react';
import { FormErrors, FormFieldErrors, SubmitButton } from '~/components';
import { publicEndorsementSchema } from '~/schemas/misc';

export const publicEndorsementActionIntent = 'public-endorsement';

export default function PublicEndorsementForm() {
  const fetcher = useFetcher({ key: publicEndorsementActionIntent });
  const fetchers = useFetchers();

  const isPending = fetchers.some(
    fetcher =>
      fetcher.state !== 'idle' && fetcher.key === publicEndorsementActionIntent && fetcher.formMethod === 'POST'
  );

  const [form, fields] = useForm({
    id: 'public-endorsement-form',
    constraint: getZodConstraint(publicEndorsementSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: publicEndorsementSchema });
    },
    defaultValue: {
      publicEndorsement: '',
    },
  });
  return (
    <fetcher.Form method="POST" {...getFormProps(form)}>
      <div>
        <label htmlFor={fields.publicEndorsement.id} className="sr-only">
          Public Endorsement
        </label>
        <textarea
          {...getTextareaProps(fields.publicEndorsement)}
          rows={3}
          placeholder="Leave a public endorsement..."
          className="block w-full rounded-md border-0 py-1.5 pl-3 shadow-sm bg-surface ring-1 ring-inset ring-around-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
        />
      </div>
      <div className="mt-3 flex justify-between">
        <div>
          {fields.publicEndorsement.errors ? (
            <FormFieldErrors field={fields.publicEndorsement} />
          ) : (
            <FormErrors errorId={form.errorId} errors={form.errors} />
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
