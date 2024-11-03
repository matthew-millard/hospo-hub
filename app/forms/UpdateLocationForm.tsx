import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useFetcher } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { FormFieldErrors, InputText, Label } from '~/components';
import { UpdateLocationSchema } from '~/schemas';

export const updateLocationActionIntent = 'update-location';

export default function UpdateLocationForm() {
  const fetcher = useFetcher({ key: 'update-location' });
  const [showInput, setshowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    if (showInput) {
      form.reset();
    }
    setshowInput(!showInput);
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus(); // Focus on the input when showInput is true
    }
  }, [showInput]);

  const [form, fields] = useForm({
    id: 'update-location-form',
    constraint: getZodConstraint(UpdateLocationSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: UpdateLocationSchema });
    },
  });

  return (
    <div>
      <Label htmlFor={fields.location.id} text="Location" classes="text-sm font-medium text-on-surface" />
      <fetcher.Form method="POST" {...getFormProps(form)} className="flex justify-between items-center mt-1">
        {showInput ? (
          <InputText ref={inputRef} fieldAttributes={{ ...getInputProps(fields.location, { type: 'text' }) }} />
        ) : (
          <dd className="text-sm text-on-surface-variant">Ottawa</dd>
        )}
        <div className="flex-shrink-0">
          {showInput ? (
            <div className="font-medium text-sm mx-4">
              <button
                type="submit"
                name="intent"
                value={updateLocationActionIntent}
                className="text-primary hover:text-primary-variant"
              >
                Update
              </button>
              <button type="button" onClick={handleChange} className="text-on-surface-variant hover:text-zinc-400 ml-4">
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleChange} className="text-primary">
              <PencilSquareIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </fetcher.Form>
      {fields.location.errors && showInput ? (
        <div className="mt-1">
          <FormFieldErrors field={fields.location} />
        </div>
      ) : null}
    </div>
  );
}
