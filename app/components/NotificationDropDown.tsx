import { useState } from 'react';
import classNames from '~/utils/classNames';

export default function NotificationDropDown() {
  return (
    <div className="absolute top-8 border border-around-surface right-0 bg-surface rounded-lg min-w-72 h-auto">
      <div className="grid grid-cols-1 gap-y-2 px-4 pt-2 border-b border-around-surface">
        <div className="flex justify-between items-baseline ">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            className="text-on-surface-variant hover:text-zinc-400 dark:hover:text-zinc-600 text-xs font-medium"
            aria-label="Mark all as read"
          >
            Mark all as read
          </button>
        </div>
        <NotificationTabs />
      </div>
      <div className="px-4 py-2 text-sm text-on-surface-variant">
        <p>You currently don't have any notifications</p>
      </div>
    </div>
  );
}

const notificationTabs = [
  {
    name: 'All',
  },
  {
    name: 'Connections',
  },
];

function NotificationTabs() {
  const [activeTab, setActiveTab] = useState('All');
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
