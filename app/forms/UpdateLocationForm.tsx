import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useFetcher } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { InputText, Label, PendingIndicator } from '~/components';
import { useOptimistic } from '~/hooks';
import { action } from '~/routes/_user.$username';

import { UpdateLocationSchema } from '~/schemas';

export const updateLocationActionIntent = 'update-location';

type Suggestions = google.maps.places.AutocompleteSuggestion[];

export default function UpdateLocationForm({ initialCity }: { initialCity?: string }) {
  const fetcher = useFetcher<typeof action>({ key: 'update-location' });
  const [showInput, setshowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestions>([]);
  const [selectedFromList, setSelectedFromList] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = fetcher.state !== 'idle';

  const autoCompleteRequest: google.maps.places.AutocompleteRequest = {
    input: inputValue,
    includedPrimaryTypes: ['locality'],
  };

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      setInputValue('');
      setshowInput(false);
      fetcher.data = undefined; // Reset the fetcher data
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
    if (inputValue.trim().length && !selectedFromList) {
      async function fetchLocationSuggestions() {
        const { AutocompleteSuggestion } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(autoCompleteRequest);
        setSuggestions(suggestions);
      }

      fetchLocationSuggestions();
    } else if (inputValue.trim().length === 0) {
      setSuggestions([]);
    }
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
      <Label htmlFor={fields.city.id} text="Location" classes="text-sm font-medium text-on-surface" />
      <fetcher.Form method="POST" {...getFormProps(form)} className="flex justify-between items-center">
        <input {...getInputProps(fields.placeId, { type: 'hidden' })} value={selectedPlaceId} />
        <input {...getInputProps(fields.region, { type: 'hidden' })} value={selectedRegion} />
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
              fieldAttributes={{ ...getInputProps(fields.city, { type: 'text' }) }}
            />
            {suggestions?.length > 0 ? (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-surface py-1 text-base shadow-lg ring-1 ring-around-surface sm:text-sm">
                {suggestions.map(({ placePrediction }) => (
                  <li
                    key={placePrediction?.placeId}
                    className="relative cursor-default py-2 pl-3 pr-8 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-on-surface-variant hover:text-zinc-900 dark:hover:text-zinc-100"
                    onClick={() => {
                      setInputValue(`${placePrediction?.mainText?.text} ${placePrediction?.secondaryText?.text}` || '');
                      setSuggestions([]);
                      setSelectedOption(placePrediction?.placeId || null);
                      setSelectedPlaceId(placePrediction?.placeId || '');
                      setSelectedRegion(placePrediction?.secondaryText?.text || '');
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
          <dd className="text-sm text-on-surface-variant">
            {useOptimistic(updateLocationActionIntent, 'city') ?? initialCity}
          </dd>
        )}
        <div className="flex-shrink-0">
          {showInput ? (
            <div className="font-medium text-sm mx-4 flex">
              <button
                type="submit"
                name="intent"
                value={updateLocationActionIntent}
                className="text-primary hover:text-primary-variant"
              >
                {isSubmitting ? <PendingIndicator color="text-dodger-blue-400" /> : 'Update'}
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
    </div>
  );
}
