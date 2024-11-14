import { BellIcon } from '@heroicons/react/24/outline';

const notifications = true;

export default function NotificationBell() {
  const handleClick = () => {
    console.log('clicked');
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-on-surface hover:text-on-surface-variant relative"
      aria-label="Notifications"
    >
      <BellIcon className="h-5 w-5" />
      {notifications ? (
        <span className="flex h-2.5 w-2.5 absolute top-1 right-1 translate-x-1/2 -translate-y-1/2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dodger-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-dodger-blue-500"></span>
        </span>
      ) : null}
    </button>
  );
}
