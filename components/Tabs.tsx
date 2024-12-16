interface TabsProps {
  activeTab: 'active' | 'completed';
  onTabChange: (tab: 'active' | 'completed') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex mb-4">
      <button
        onClick={() => onTabChange('active')}
        className={`flex-1 p-2 ${
          activeTab === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Tareas Activas
      </button>
      <button
        onClick={() => onTabChange('completed')}
        className={`flex-1 p-2 ${
          activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Tareas Completadas
      </button>
    </div>
  );
}

