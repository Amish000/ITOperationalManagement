import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../constants/paths';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Access Denied
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        You don't have permission to access this page.
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <Link
                        to={PATHS.HOME}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Return to Home
                    </Link>
                    <Link
                        to={PATHS.LOGIN}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Login with Different Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
