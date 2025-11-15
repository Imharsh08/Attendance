
import React, { useState, useEffect, useCallback } from 'react';
import { AttendanceEntry, NewAttendanceEntry, AttendanceStatus } from './types';
import Header from './components/Header';
import AttendanceTable from './components/AttendanceTable';
import AttendanceFormModal from './components/AttendanceFormModal';
import Loader from './components/Loader';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [entryToEdit, setEntryToEdit] = useState<AttendanceEntry | null>(null);

  const [appScriptUrl, setAppScriptUrl] = useState<string>(localStorage.getItem('appScriptUrl') || '');
  const [sheetUrl, setSheetUrl] = useState<string>(localStorage.getItem('sheetUrl') || '');
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(!!localStorage.getItem('sheetUrl'));

  const handleApiResponse = async <T,>(response: Response): Promise<T> => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'An unknown error occurred.');
    }
    return data.data;
  };
  
  const apiCall = useCallback(async (action: string, payload?: any) => {
    if (!appScriptUrl) {
      throw new Error("Google Apps Script URL is not set.");
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(appScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
      });
      return await handleApiResponse(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [appScriptUrl]);

  const fetchEntries = useCallback(async () => {
    if (!isSetupComplete) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await apiCall('getEntries');
      setEntries(data.entries || []);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, isSetupComplete]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSetup = async () => {
    try {
      const data: any = await apiCall('setup');
      setSheetUrl(data.sheetUrl);
      localStorage.setItem('appScriptUrl', appScriptUrl);
      localStorage.setItem('sheetUrl', data.sheetUrl);
      setIsSetupComplete(true);
      await fetchEntries();
    } catch (err) {
      // Error is already set by apiCall
    }
  };

  const handleAddEntry = async (entry: NewAttendanceEntry) => {
    try {
      const data: any = await apiCall('addEntry', entry);
      setEntries(prev => [...prev, data.entry]);
      setIsFormModalOpen(false);
    } catch (err) {
      // Error is set in apiCall
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdateEntry = async (entry: AttendanceEntry) => {
    try {
      await apiCall('updateEntry', entry);
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
      setIsFormModalOpen(false);
      setEntryToEdit(null);
    } catch(err) {
      // Error is set in apiCall
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await apiCall('deleteEntry', { id });
        setEntries(prev => prev.filter(e => e.id !== id));
      } catch(err) {
        // Error is set in apiCall
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditClick = (entry: AttendanceEntry) => {
    setEntryToEdit(entry);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEntryToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setEntryToEdit(null);
  };

  const renderSetup = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">One-Click Setup</h2>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Enter your Google Apps Script Web App URL to connect to your Google Sheet.
        </p>
        
        <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.006-1.742 3.006H4.42c-1.53 0-2.493-1.672-1.743-3.006l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.008a1 1 0 011 1v3.667a1 1 0 01-1 1H9a1 1 0 01-1-1V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You need to create a Google Apps Script and deploy it as a web app. The script will handle all communication with your Google Sheet. Please ensure your script can handle `setup`, `getEntries`, `addEntry`, `updateEntry`, and `deleteEntry` actions.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="app-script-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Web App URL
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="app-script-url"
              id="app-script-url"
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              placeholder="https://script.google.com/macros/s/..."
              value={appScriptUrl}
              onChange={(e) => setAppScriptUrl(e.target.value)}
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

        <button
          onClick={handleSetup}
          disabled={!appScriptUrl || isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader /> : 'Create Sheet & Connect'}
        </button>
      </div>
    </div>
  );

  const renderApp = () => (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <main>
          {isLoading && !isFormModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <Loader />
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
             <div className="p-6">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Records</h2>
                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Connected to: <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{sheetUrl}</a>
                 </p>
             </div>
             <AttendanceTable
                entries={entries}
                onEdit={handleEditClick}
                onDelete={handleDeleteEntry}
             />
          </div>

          <button
            onClick={handleAddNewClick}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Add new attendance entry"
          >
            <PlusIcon />
          </button>
        </main>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      {isSetupComplete ? renderApp() : renderSetup()}
      {isFormModalOpen && (
        <AttendanceFormModal
          isOpen={isFormModalOpen}
          onClose={handleFormClose}
          onSubmit={entryToEdit ? handleUpdateEntry : handleAddEntry}
          initialData={entryToEdit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default App;
