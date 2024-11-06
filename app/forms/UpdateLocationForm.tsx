import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useFetcher } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { FormFieldErrors, InputText, Label } from '~/components';
import { UpdateLocationSchema } from '~/schemas';

export const updateLocationActionIntent = 'update-location';

type Suggestions = google.maps.places.AutocompleteSuggestion[];

export default function UpdateLocationForm() {
  const fetcher = useFetcher({ key: 'update-location' });
  const [showInput, setshowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestions>([]);
  const [selectedFromList, setSelectedFromList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const autoCompleteRequest: google.maps.places.AutocompleteRequest = {
    input: inputValue,
    includedPrimaryTypes: ['locality'],
  };

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
    async function getPlaceSuggestions() {
      if (inputValue.trim().length && !selectedFromList) {
        const { AutocompleteSuggestion } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(autoCompleteRequest);

        setSuggestions(suggestions);
      } else if (inputValue.trim().length === 0) {
        setSuggestions([]);
      }
    }

    getPlaceSuggestions();
  }, [inputValue, selectedFromList, showInput]);

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
          <div className="relative">
            <InputText
              onChange={e => {
                setInputValue(e.target.value);
                setSelectedFromList(false);
              }}
              value={inputValue}
              placeholder="Enter your location"
              ref={inputRef}
              fieldAttributes={{ ...getInputProps(fields.location, { type: 'text' }) }}
            />
            {suggestions?.length > 0 ? (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-surface py-1 text-base shadow-lg ring-1 ring-around-surface sm:text-sm">
                {suggestions.map(({ placePrediction }) => (
                  <li
                    key={placePrediction?.placeId}
                    className="relative cursor-default py-2 pl-3 pr-8 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-on-surface-variant hover:text-zinc-900 dark:hover:text-zinc-100"
                    onClick={() => {
                      setInputValue(placePrediction?.mainText?.text || '');
                      setSuggestions([]);
                      setSelectedOption(placePrediction?.placeId || null);
                      setSelectedFromList(true);
                    }}
                  >
                    <span className="block truncate">
                      {placePrediction?.mainText?.text}, {placePrediction?.secondaryText?.text}
                    </span>

                    {selectedOption === placePrediction?.placeId ? (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-primary">
                        <CheckIcon aria-hidden="true" className="h-5 w-5" />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
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
              <button
                type="button"
                onClick={() => {
                  setshowInput(!showInput);
                  setInputValue('');
                  setSuggestions([]);
                }}
                className="text-on-surface-variant hover:text-zinc-400 ml-4"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setshowInput(!showInput)} className="text-primary">
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
