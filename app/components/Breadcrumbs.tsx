import { HomeIcon } from '@heroicons/react/24/outline';
import { Link, useMatches } from '@remix-run/react';
import classNames from '~/utils/classNames';

export default function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav aria-label="Breadcrumb">
      <div className="hidden md:block border-t border-around-surface py-3 max-w-screen-xl mx-auto">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <Link to="/" prefetch="intent" className="text-zinc-500 hover:text-zinc-400">
                <HomeIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>

          {matches
            .filter(match => match.handle && match.handle.breadcrumb)
            .map(match => (
              <li key={match.id}>
                <div className="flex items-center">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-5 w-5 flex-shrink-0 text-zinc-500"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  {match.handle.breadcrumb(match)}
                </div>
              </li>
            ))}
        </ol>
      </div>
    </nav>
  );
}

export function Breadcrumb({ name, to }: { name?: string; to?: string }) {
  return (
    <Link
      to={to || '/'}
      prefetch="intent"
      className={classNames('ml-4 text-sm font-medium', 'text-zinc-500 hover:text-zinc-400')}
    >
      {name}
    </Link>
  );
}
