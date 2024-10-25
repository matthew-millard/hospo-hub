import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import LogoutForm from './LogoutForm';
import FallbackAvatar from './FallbackAvatar';

type ProfileDropdownProps = {
  userNavigation: { name: string; description: string; path: string; icon: any }[];
  username: string;
  url: string | undefined;
};

export default function ProfileDropdown({ userNavigation, username, url }: ProfileDropdownProps) {
  return (
    <Menu as="div" className="relative">
      <div>
        <MenuButton className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          {url ? (
            <img alt={username} src={url} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <FallbackAvatar height="h-8" width="w-8" />
          )}
          {/* <PlaceholderIcon /> */}
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-surface py-1 shadow-lg ring-1 ring-around-surface transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {userNavigation.map(item => {
          return (
            <MenuItem key={item.name}>
              <a
                href={`/${username}${item.path}`}
                className="py-2.5 px-4 text-on-surface data-[focus]:bg-on-surface-hover flex items-center rounded-md hover:bg-on-surface-hover"
              >
                <item.icon aria-hidden="true" className="h-6 w-6 flex-shrink-0 text-primary" />
                <span className="ml-3 text-on-surface">{item.name}</span>
              </a>
            </MenuItem>
          );
        })}
        <MenuItem>
          <div className="px-4 py-2.5 hover:bg-on-surface-hover bg-surface">
            <LogoutForm />
          </div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
