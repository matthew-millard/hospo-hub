import PendingIndicator from './PendingIndicator';

type SubmitButtonProps = {
  fieldAttributes: React.ButtonHTMLAttributes<HTMLButtonElement>;
  text: string;
  isPending: boolean;
  pendingText: 'Logging in...' | 'Signing up...' | 'Submitting...' | 'Updating...' | 'Deleting...' | 'Posting...';
};

export default function SubmitButton({ fieldAttributes, text, isPending, pendingText }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      {...fieldAttributes}
      className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-on-primary shadow-sm hover:bg-primary-variant disabled:bg-primary-variant active:bg-primary-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? <PendingIndicator pendingText={pendingText} /> : text}
    </button>
  );
}
