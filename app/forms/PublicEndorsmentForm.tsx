import { getFormProps, getInputProps, getTextareaProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData, useFetcher, useFetchers } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { FormErrors, FormFieldErrors, SubmitButton } from "~/components";
import { action } from "~/routes/_user.$username_.settings";
import { publicEndorsementSchema } from "~/schemas/misc";

export const publicEndorsementActionIntent = "public-endorsement";

export default function PublicEndorsementForm({ endorsedUserId }: { endorsedUserId: string | undefined }) {
  const lastResult = useActionData<typeof action>();
  const fetcher = useFetcher({ key: publicEndorsementActionIntent });
  const fetchers = useFetchers();
  const formRef = useRef(null);

  const isPending = fetchers.some(fetcher => fetcher.state !== "idle" && fetcher.key === publicEndorsementActionIntent && fetcher.formMethod === "POST");

  const [form, fields] = useForm({
    id: "public-endorsement-form",
    lastResult,
    constraint: getZodConstraint(publicEndorsementSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: publicEndorsementSchema });
    },
    defaultValue: {
      body: "",
    },
  });

  return (
    <fetcher.Form method="POST" {...getFormProps(form)} ref={formRef}>
      <input {...getInputProps(fields.endorsedUserId, { type: "hidden" })} value={endorsedUserId} />
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
        <div>{fields.body.errors ? <FormFieldErrors field={fields.body} /> : <FormErrors errorId={form.errorId} errors={form.errors} />}</div>

        <div>
          <SubmitButton fieldAttributes={{ form: form.id, name: "intent", value: publicEndorsementActionIntent }} text="Post" isPending={isPending} pendingText="Posting..." />
        </div>
      </div>
    </fetcher.Form>
  );
}
