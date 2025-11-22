import React, { useState, useMemo } from 'react';
import { Activity, Download, Filter, RefreshCw, Calendar, Hash, ExternalLink } from 'lucide-react';
import useEvents from '../hooks/useEvents';

const EventViewer = ({ address, abi, chainId }) => {
  const { events, loading, error, refetch } = useEvents(address, abi, chainId);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique event names
  const eventNames = useMemo(() => {
    if (!abi) return [];
    return abi
      .filter(item => item.type === 'event')
      .map(event => event.name);
  }, [abi]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesType = selectedEvent === 'all' || event.eventName === selectedEvent;
      const matchesSearch = searchTerm === '' || 
        event.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(event.args).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [events, selectedEvent, searchTerm]);

  // Export to JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-${address}-${Date.now()}.json`;
    link.click();
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Event Name', 'Block', 'Transaction Hash', 'Timestamp', 'Arguments'];
    const rows = filteredEvents.map(event => [
      event.eventName,
      event.blockNumber,
      event.transactionHash,
      new Date(event.timestamp).toISOString(),
      JSON.stringify(event.args)
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-${address}-${Date.now()}.csv`;
    link.click();
  };

  const getExplorerUrl = (txHash) => {
    const explorers = {
      '1': 'https://etherscan.io/tx/',
      '11155111': 'https://sepolia.etherscan.io/tx/',
      '137': 'https://polygonscan.com/tx/',
      '80002': 'https://amoy.polygonscan.com/tx/',
      '56': 'https://bscscan.com/tx/'
    };
    return explorers[chainId] + txHash;
  };

  if (!abi) return null;

  return (
    <div className="w-full max-w-5xl mt-8">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-indigo-400" size={24} />
            Contract Events
          </h2>
          <div className="flex gap-2">
            <button
              onClick={refetch}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh events"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={exportToJSON}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Export to JSON"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by transaction hash or arguments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Events</option>
            {eventNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Events List */}
        {error && (
          <div className="text-rose-400 text-sm p-4 bg-rose-950/20 border border-rose-800/50 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && events.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Activity className="mx-auto mb-2 opacity-50" size={32} />
            <p>No events found</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 hover:border-indigo-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-950/50 text-indigo-400 text-xs font-medium rounded">
                      {event.eventName}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Hash size={12} />
                      {event.blockNumber}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Arguments */}
                {Object.keys(event.args).length > 0 && (
                  <div className="mt-2 p-2 bg-slate-900 rounded text-xs font-mono">
                    {Object.entries(event.args).map(([key, value]) => (
                      <div key={key} className="flex gap-2 py-1">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-slate-300 break-all">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transaction Hash */}
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={getExplorerUrl(event.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                  >
                    {event.transactionHash.slice(0, 10)}...{event.transactionHash.slice(-8)}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>Showing {filteredEvents.length} of {events.length} events</span>
          <span>Auto-refreshing every 10s</span>
        </div>
      </div>
    </div>
  );
};

export default EventViewer;
