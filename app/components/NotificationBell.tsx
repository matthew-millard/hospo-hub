import { BellIcon } from '@heroicons/react/24/outline';
import { Form } from '@remix-run/react';
import { AuthenticityTokenInput } from 'remix-utils/csrf/react';
import { HoneypotInputs } from 'remix-utils/honeypot/react';

export const updateNotificationsLastViewedActionIntent = 'update-notifications-last-viewed';

export default function NotificationBell({
  userId,
  hasUnreadNotifications,
  setHasUnreadNotifications,
  showNotifications,
  setShowNotifications,
}: {
  userId: string;
  hasUnreadNotifications: boolean;
  setHasUnreadNotifications: (unreadNotifications: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}) {
  return (
    <Form
      method="POST"
      navigate={false}
      fetcherKey={updateNotificationsLastViewedActionIntent}
      className="flex justify-center"
    >
      <HoneypotInputs />
      <AuthenticityTokenInput />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        onClick={() => {
          setShowNotifications(!showNotifications);
          setHasUnreadNotifications(false);
        }}
        name="intent"
        value={updateNotificationsLastViewedActionIntent}
        className="text-on-surface hover:text-on-surface-variant relative"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
        {hasUnreadNotifications ? (
          <span className="flex h-2.5 w-2.5 absolute top-1 right-1 translate-x-1/2 -translate-y-1/2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dodger-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-dodger-blue-500"></span>
          </span>
        ) : null}
      </button>
    </Form>
  );
}
