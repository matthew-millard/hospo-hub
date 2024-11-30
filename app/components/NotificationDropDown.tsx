import { useMemo, useState } from 'react';
import classNames from '~/utils/classNames';
import timeAgo from '~/utils/timeAgo';
import { Link, useRouteLoaderData } from '@remix-run/react';
import { loader } from '~/root';
import FallbackAvatar from './FallbackAvatar';
import { MarkAllAsReadForm } from '~/forms';

export enum NotificationTypes {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
}

const notificationTabs: { name: ActiveTab }[] = [
  {
    name: 'All',
  },
  {
    name: 'Unread',
  },
];

type ActiveTab = 'All' | 'Unread';

export default function NotificationDropDown() {
  const data = useRouteLoaderData<typeof loader>('root');
  const notifications = data?.user?.notifications;

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return notifications?.some(notifications => !notifications.isRead) ? 'Unread' : 'All';
  });

  const filteredNotifications = useMemo(() => {
    if (notifications && notifications.length > 0 && activeTab === 'Unread') {
      return notifications.filter(notification => !notification.isRead);
    }
    return notifications;
  }, [activeTab, notifications]);

  return (
    <div className="absolute top-8 border border-around-surface -right-14 bg-surface rounded-lg w-[400px] overflow-scroll shadow-xl">
      <div className="grid grid-cols-1 gap-y-2 px-4 pt-2 border-b border-around-surface bg-surface sticky top-0">
        <div className="flex justify-between items-baseline">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <MarkAllAsReadForm />
        </div>
        <NotificationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="text-sm text-on-surface-variant flex flex-col py-2">
        {filteredNotifications && filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <p className="px-4 italic">
            {activeTab === 'Unread'
              ? "You don't have any unread notifications."
              : "You currently don't have any notifications."}
          </p>
        )}
      </div>
    </div>
  );
}

function NotificationTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: ActiveTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
}) {
  return (
    <div className="grid grid-flow-col auto-cols-max justify-items-start -mb-px space-x-8">
      {notificationTabs.map(tab => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={classNames(
            'text-sm font-semibold border-b-2 pb-2',
            tab.name === activeTab
              ? 'text-on-surface border-primary'
              : 'text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 border-transparent hover:border-zinc-300 dark:hover:border-zinc-500'
          )}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
}: {
  notification: {
    id: string;
    type: string;
    userId: string;
    isRead: boolean;
    metadata: string | null;
    createdAt: string;
    updatedAt: string;
  };
}) {
  let metadata;
  if (notification.metadata) {
    metadata = JSON.parse(notification.metadata);
  }
  return (
    <div className="flex  items-center mx-2 py-2 px-4 hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-md">
      <Link to={`/${metadata.username}`} className="flex-none mr-4">
        {metadata.profileImageUrl ? (
          <img
            src={metadata.profileImageUrl}
            alt={`${metadata.firstName} ${metadata.lastName}`}
            className="rounded-full object-cover w-12 h-12"
          />
        ) : (
          <FallbackAvatar height="h-12" width="w-12" />
        )}
      </Link>
      <div className="text-on-surface grow flex flex-col gap-y-2">
        <div>
          <Link to={`${metadata.username}`} className="flex">
            <p>
              <span className="hover:text-on-surface-variant">{`${metadata.firstName} ${metadata.lastName}`}</span>{' '}
              wants to connect with you
            </p>
          </Link>
          <p className="text-xs text-on-surface-variant">{timeAgo(new Date(notification.createdAt))}</p>
        </div>
        <div className="flex gap-x-2">
          <button className="font-medium px-3 py-1.5 bg-primary rounded-md text-on-primary hover:bg-primary-variant">
            Accept
          </button>
          <button className="font-medium px-3 py-1.5 bg-zinc-400 hover:bg-zinc-500 rounded-md text-white">
            Decline
          </button>
        </div>
      </div>
      <div className="flex-none">
        <div className="h-full w-full flex items-center justify-end">
          {notification.isRead ? null : <span className="ml-auto rounded-full h-2.5 w-2.5 bg-dodger-blue-500"></span>}
        </div>
      </div>
    </div>
  );
}
