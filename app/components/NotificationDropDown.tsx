import { useMemo, useState } from 'react';
import classNames from '~/utils/classNames';
import timeAgo from '~/utils/timeAgo';

export enum NotificationTypes {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
}

const notifications = [
  {
    id: '123',
    isRead: false,
    title: 'Hamish Millard wants to connect with you',
    firstName: 'Hamish',
    lastName: 'Millard',
    imageUrl:
      'https://res.cloudinary.com/hospohub/image/upload/v1729867410/users/cm1xtvz2k000a138fi97qlbxg/images/gpu3fu2ipdniyhizugyh.jpg',
  },
  {
    id: '456',
    isRead: true,
    title: 'Amy Millard wants to connect with you',
    firstName: 'Amy',
    lastName: 'Millard',
    imageUrl:
      'https://res.cloudinary.com/hospohub/image/upload/v1729867410/users/cm1xtvz2k000a138fi97qlbxg/images/gpu3fu2ipdniyhizugyh.jpg',
  },
  {
    id: '789',
    isRead: true,
    title: 'Finn Millard wants to connect with you',
    firstName: 'Finn',
    lastName: 'Millard',
    imageUrl:
      'https://res.cloudinary.com/hospohub/image/upload/v1729867410/users/cm1xtvz2k000a138fi97qlbxg/images/gpu3fu2ipdniyhizugyh.jpg',
  },
];

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('All');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'Unread') {
      return notifications.filter(notification => !notification.isRead);
    }
    return notifications;
  }, [activeTab, notifications]);

  return (
    <div className="absolute top-8 border border-around-surface -right-14 bg-surface rounded-lg w-96 overflow-scroll">
      <div className="grid grid-cols-1 gap-y-2 px-4 pt-2 border-b border-around-surface bg-surface sticky top-0">
        <div className="flex justify-between items-baseline">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            className="text-on-surface-variant hover:text-zinc-400 dark:hover:text-zinc-600 text-xs font-medium"
            aria-label="Mark all as read"
          >
            Mark all as read
          </button>
        </div>
        <NotificationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="text-sm text-on-surface-variant flex flex-col px-4 py-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => <NotificationItem key={notification.id} {...notification} />)
        ) : (
          <p>
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

function NotificationItem({ id, title, firstName, lastName, imageUrl }: (typeof notifications)[0]) {
  return (
    <div className="flex items-center py-1">
      <img src={imageUrl} alt={`${firstName} ${lastName}`} className="rounded-full object-cover w-12 h-12" />
      <div className="ml-4 text-on-surface flex flex-col gap-y-2">
        <div>
          <p>{title}</p>
          <p className="text-xs text-on-surface-variant">{timeAgo(new Date('2023-09-15T14:23:00Z'))}</p>
        </div>
        <div className="flex gap-x-2">
          <button className="font-medium px-3 py-1.5 bg-primary rounded-md text-on-primary hover:bg-primary-variant">
            Accept
          </button>
          <button className="font-medium px-3 py-1.5 bg-zinc-400 rounded-md text-white hover:bg-zinc-400">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
