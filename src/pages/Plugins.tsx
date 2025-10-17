import React, { useState, useEffect } from 'react';
import { Package, Download, Settings, Check, AlertCircle } from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  installed: boolean;
  enabled: boolean;
  icon: string;
}

const Plugins: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      const response = await fetch('/api/plugins');
      const data = await response.json();
      setPlugins(data.plugins || []);
    } catch (error) {
      console.error('Error fetching plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallPlugin = async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/${pluginId}/install`, {
        method: 'POST',
      });
      const data = await response.json();
      setPlugins(plugins.map((plugin) =>
        plugin.id === pluginId ? { ...plugin, installed: true } : plugin
      ));
    } catch (error) {
      console.error('Error installing plugin:', error);
    }
  };

  const handleTogglePlugin = async (pluginId: string) => {
    try {
      const plugin = plugins.find((p) => p.id === pluginId);
      if (!plugin) return;

      const response = await fetch(`/api/plugins/${pluginId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !plugin.enabled }),
      });
      const data = await response.json();
      setPlugins(plugins.map((p) =>
        p.id === pluginId ? { ...p, enabled: !p.enabled } : p
      ));
    } catch (error) {
      console.error('Error toggling plugin:', error);
    }
  };

  const handleUninstallPlugin = async (pluginId: string) => {
    try {
      await fetch(`/api/plugins/${pluginId}/uninstall`, {
        method: 'DELETE',
      });
      setPlugins(plugins.map((plugin) =>
        plugin.id === pluginId ? { ...plugin, installed: false, enabled: false } : plugin
      ));
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <Package className="w-6 h-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Plugin Manager</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Extend TSUBA's functionality with plugins
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading plugins...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.map((plugin) => (
              <div
                key={plugin.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{plugin.name}</h3>
                      <p className="text-sm text-gray-500">v{plugin.version}</p>
                    </div>
                  </div>
                  {plugin.installed && plugin.enabled && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3">{plugin.description}</p>
                <p className="text-xs text-gray-500 mb-4">By {plugin.author}</p>

                <div className="flex gap-2">
                  {!plugin.installed ? (
                    <button
                      onClick={() => handleInstallPlugin(plugin.id)}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Install
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleTogglePlugin(plugin.id)}
                        className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                          plugin.enabled
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {plugin.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleUninstallPlugin(plugin.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Uninstall
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && plugins.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No plugins available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plugins;
