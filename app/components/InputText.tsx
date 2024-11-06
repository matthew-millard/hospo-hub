import { forwardRef } from 'react';

type InputTextProps = {
  fieldAttributes: React.InputHTMLAttributes<HTMLInputElement>;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ fieldAttributes, onChange, value, placeholder }, ref) => (
    <input
      {...fieldAttributes}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      ref={ref}
      key={null}
      autoComplete="off"
      className="block w-full rounded-md bg-transparent border-0 py-1.5 pl-3 pr-2 text-on-surface shadow-sm ring-1 ring-inset ring-around-surface focus:outline-none  focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 aria-[invalid]:ring-error"
    />
  )
);

export default InputText;
