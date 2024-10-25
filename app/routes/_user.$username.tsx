import { LoaderFunctionArgs } from '@remix-run/node';
import { useFetchers, useLoaderData } from '@remix-run/react';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { FallbackAvatar } from '~/components';
import { DeleteDocumentForm, UploadDocumentForm, UploadProfileImageForm } from '~/forms';
import classNames from '~/utils/classNames';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request); // throws if user is not logged in

  // get user's document data and return it
  const data = await prisma.user.findUnique({
    where: { username: params.username },
    include: { documents: true, profileImage: true },
  });
  const isCurrentUser = data?.id === userId;

  return { ...data, isCurrentUser };
}

export default function UserProfileRoute() {
  const data = useLoaderData<typeof loader>();
  const isCurrentUser = data.isCurrentUser;
  const fetchers = useFetchers();

  const isDeletingDocument = (documentId: string) => {
    return fetchers.some(fetcher => {
      return fetcher.formAction === `/resource/${documentId}` && fetcher.formMethod === 'POST';
    });
  };

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl xl:max-w-full lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="relative flex-shrink-0">
            {data.profileImage?.url ? (
              <img
                className="h-20 w-20 lg:h-24 lg:w-24 rounded-full object-cover shadow-md"
                src={data.profileImage?.url}
              />
            ) : (
              <FallbackAvatar height="h-20 lg:h-24" width="w-20 lg:w-24" />
            )}
            {isCurrentUser ? (
              <div className="absolute bottom-0 right-0">
                <UploadProfileImageForm />
              </div>
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{`${data.firstName} ${data.lastName}`}</h1>
            <p className="text-sm font-medium text-on-surface-variant">
              Bartender and server at Giulia Pizza Elgin Street
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:mx-0 lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          <section aria-labelledby="personal-information-title">
            <div className="bg-surface dark:bg-zinc-950 shadow sm:rounded-lg border border-around-surface">
              <div className="px-4 py-5 sm:px-6">
                <h2 id="personal-information-title" className="text-lg font-medium leading-6 text-on-surface">
                  Personal Information
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">Personal details and resume.</p>
              </div>

              <div className="border-t border-across-surface px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-on-surface">Current Position</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">
                      Bartender and server at Giulia Pizza Elgin Street
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-on-surface">Email address</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">{data.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-on-surface">Location</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">Ottawa, Canada</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-on-surface">Phone</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">+1 (613) 223-9371</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-on-surface">About</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">
                      Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat.
                      Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                      proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-on-surface">Resume & References</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">
                      <ol
                        role="list"
                        className="divide-y divide-across-surface border rounded-md border-around-surface"
                      >
                        {isCurrentUser ? <UploadDocumentForm /> : null}
                        {/* Has documents? Show documents : fallback to 'This user currently has not documents */}
                        {data.documents?.map(document => (
                          <li
                            key={document.id}
                            className={classNames(
                              'items-center justify-between py-2 pl-4 pr-6 text-sm',
                              isDeletingDocument(document.id) ? 'hidden' : 'flex'
                            )}
                          >
                            <a
                              href={`/resource/${document.id}`}
                              className="flex w-0 flex-1 items-center h-6 font-medium text-primary hover:text-primary-variant disabled:text-dodger-blue-800 disabled:cursor-not-allowed"
                              download={document.fileName}
                            >
                              {isCurrentUser ? <DeleteDocumentForm documentId={document.id} /> : null}
                              <span className="w-0 flex-1 truncate text-zinc-500">{document.fileName}</span>
                              <div className="ml-4 flex-shrink-0 flex">Download</div>
                            </a>
                          </li>
                        ))}
                      </ol>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
