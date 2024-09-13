import React, { useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import tripsaathiLogo from '../img/tripsaathi_black_transparent.png';

interface Navigation {
  pages: { name: string; to: string; selected: boolean }[];
  user: { name: string; to: string }[];
}

export default function Header({ navigation }: { navigation: Navigation }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Mobile menu */}
      <Transition show={open} as={React.Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <TransitionChild
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 z-40 flex">
            <TransitionChild
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="ml-4 flex flex-1 items-center justify-center">
                    <img src={tripsaathiLogo} alt="TripSaathi" className="h-8 w-auto" />
                  </div>
                </div>

                <div className="mt-6 space-y-2 px-4">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.to}
                      className={`block rounded-md px-3 py-2 text-base font-medium ${
                        page.selected
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="space-y-2 px-4">
                    {navigation.user.map((page) => (
                      <Link
                        key={page.name}
                        to={page.to}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                        onClick={() => {
                          if (page.name === 'Log out') handleLogout();
                          setOpen(false);
                        }}
                      >
                        {page.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      <header className="relative bg-white shadow-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src={tripsaathiLogo} alt="TripSaathi" className="h-10 w-auto" />
                <span className="ml-2 text-xl font-bold text-gray-900">TripSaathi</span>
              </Link>
              <div className="hidden ml-10 space-x-4 lg:block">
                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    to={page.to}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      page.selected
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden lg:flex lg:items-center lg:space-x-6">
                {navigation.user.map((page) => (
                  <Link
                    key={page.name}
                    to={page.to}
                    className="text-sm font-medium text-gray-700 hover:text-blue-700"
                    onClick={() => {
                      if (page.name === 'Log out') handleLogout();
                    }}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
              <button
                type="button"
                className="ml-4 rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}