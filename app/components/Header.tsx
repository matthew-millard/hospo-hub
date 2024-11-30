import { Popover, PopoverPanel } from '@headlessui/react';
import { Bars3Icon, Cog6ToothIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import {
  Breadcrumbs,
  FallbackAvatar,
  LinkButton,
  LinkWithPrefetch,
  LogoutForm,
  MenuToggle,
  NotificationBell,
  NotificationDropDown,
  PreTextWithLink,
  ProfileDropdown,
  ThemeSwitcher,
} from '../components';
import { Link, useRouteLoaderData } from '@remix-run/react';
import { useOptionalUser } from '~/hooks/useOptionalUser';
import { loader } from '~/root';
import { useState } from 'react';

export const userNavigation = [
  {
    name: 'Profile',
    description: 'Your profile information.',
    path: '',
    icon: UserCircleIcon,
  },
  {
    name: 'Account settings',
    description: 'Your account settings.',
    path: '/settings',
    icon: Cog6ToothIcon,
  },
];

export default function Header() {
  const isLoggedInUser = useOptionalUser();
  const data = useRouteLoaderData<typeof loader>('root');
  const [showNotifications, setShowNotifications] = useState(false);

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(() => {
    const lastViewed = data?.user?.notificationsLastViewed;
    return (
      data?.user?.notifications.some(
        notification => !notification.isRead && (!lastViewed || new Date(notification.createdAt) > new Date(lastViewed))
      ) ?? false
    );
  });

  return (
    <Popover className="sticky top-0 z-50">
      <div className="mx-auto px-6 bg-surface dark:bg-zinc-900 border-b border-around-surface shadow-lg">
        <div className="mx-auto flex items-center justify-between py-3 md:justify-start md:space-x-10 max-w-screen-xl">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Logo />
          </div>

          <div className="-my-2 md:hidden">
            <MenuToggle>
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </MenuToggle>
          </div>

          <div className="hidden items-center justify-end md:flex md:flex-1 md:gap-x-5 lg:w-0">
            <ThemeSwitcher />

            {isLoggedInUser ? (
              <>
                <div className="relative flex items-center">
                  <NotificationBell
                    userId={isLoggedInUser.id}
                    hasUnreadNotifications={hasUnreadNotifications}
                    setHasUnreadNotifications={setHasUnreadNotifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                  />
                  {showNotifications ? <NotificationDropDown /> : null}
                </div>
                <ProfileDropdown
                  userNavigation={userNavigation}
                  username={isLoggedInUser.username}
                  url={data?.user?.profileImage?.url}
                />
              </>
            ) : (
              <>
                <LinkWithPrefetch to="/login">
                  <span>Log in →</span>
                </LinkWithPrefetch>
                <LinkButton to="/signup" prefetch="intent">
                  <span>Sign up</span>
                </LinkButton>
              </>
            )}
          </div>
        </div>
        {isLoggedInUser ? <Breadcrumbs /> : null}
      </div>

      <PopoverPanel
        transition
        className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in md:hidden"
      >
        <div className="divide-y divide-around-surface rounded-lg bg-background shadow-lg ring-1 ring-around-surface">
          <div className="px-5 pb-6 pt-5">
            <div className="flex items-center justify-between">
              <Logo />
              <div className="-mr-2">
                <MenuToggle>
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </MenuToggle>
              </div>
            </div>
            {isLoggedInUser ? (
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {userNavigation.map(item => (
                    <a
                      key={item.name}
                      href={`/${isLoggedInUser.username}${item.path}`}
                      className="-m-3 flex items-center rounded-md p-3 hover:bg-on-surface-hover"
                    >
                      <item.icon aria-hidden="true" className="h-6 w-6 flex-shrink-0 text-primary" />
                      <span className="ml-3 text-base font-medium text-on-surface">{item.name}</span>
                    </a>
                  ))}

                  <LogoutForm />
                </nav>
              </div>
            ) : null}
          </div>
          {isLoggedInUser ? (
            <div className="px-5 py-3">
              <a
                href={`/${isLoggedInUser.username}`}
                className="flex gap-x-3 items-center rounded-md text-on-surface hover:text-on-surface-variant"
              >
                {data?.user?.profileImage?.url ? (
                  <img
                    alt={`${data?.user?.firstName} ${data?.user?.lastName}`}
                    src={data?.user?.profileImage?.url}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <FallbackAvatar height="h-8" width="w-8" />
                )}
                <span className="sr-only">Your profile</span>
                <span aria-hidden="true">{`${isLoggedInUser.firstName} ${isLoggedInUser.lastName}`}</span>
              </a>
            </div>
          ) : (
            <div className="space-y-6 px-5 py-6 min-h-96 flex flex-col justify-end">
              <div>
                <Link
                  to="/signup"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary hover:bg-primary-variant active:bg-primary-variant px-4 py-2 text-base font-medium text-on-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface"
                >
                  Sign up
                </Link>
                <PreTextWithLink preText="Already have an account?" to="/login" text="Log in" />
              </div>
            </div>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
