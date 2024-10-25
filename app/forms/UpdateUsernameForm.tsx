import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { FormErrors, FormFieldErrors, InputText, Label, OutlineButton } from '~/components';
import { useIsPending } from '~/hooks';
import { action, loader, updateUsernameActionIntent } from '~/routes/_user.$username_.settings';
import { UpdateUsernameSchema } from '~/schemas';

export default function UpdateUsernameForm() {
  const { user } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const lastResultUsername = lastResult?.initialValue?.intent === updateUsernameActionIntent ? lastResult : null;

  const [form, fields] = useForm({
    id: 'update-username-form',
    lastResult: lastResultUsername,
    constraint: getZodConstraint(UpdateUsernameSchema),
    defaultValue: {
      username: user?.username,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: UpdateUsernameSchema,
      });
    },
  });

  return (
    <Form method="POST" className="mt-8" {...getFormProps(form)} preventScrollReset>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor={fields.username.id} text="Username" />
        <InputText
          fieldAttributes={{
            ...getInputProps(fields.username, { type: 'text' }),
          }}
        />
        <FormFieldErrors field={fields.username} />
      </div>
      <div className="mt-6">
        <OutlineButton
          type="submit"
          text="Update"
          name="intent"
          value={updateUsernameActionIntent}
          isPending={useIsPending({ formIntent: updateUsernameActionIntent })}
          pendingText="Updating..."
        />
      </div>
      <div className="mt-3">
        <FormErrors errorId={form.errorId} errors={form.errors} />
      </div>
    </Form>
  );
}
