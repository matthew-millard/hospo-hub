import classNames from '~/utils/classNames';

export default function FallbackAvatar({
  height,
  width,
  isPending,
}: {
  height: string;
  width: string;
  isPending?: boolean;
}) {
  return (
    <span
      className={classNames(
        'inline-block overflow-hidden rounded-full bg-gray-100 shadow-md',
        height,
        width,
        isPending ? 'animate-pulse' : ''
      )}
    >
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-full w-full text-gray-300">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  );
}
