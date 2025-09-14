import { useState } from 'react'
import { 
  Search, 
  Calendar, 
  Clock, 
  CheckSquare, 
  StickyNote, 
  Plus, 
  Menu,
  ChevronRight,
  X,
  Bell,
  LogOut,
  User
} from 'lucide-react'

const Sidebar = ({ currentView, setCurrentView, tasks, lists, addList, updateList, selectedList, setSelectedList, sidebarOpen, setSidebarOpen, notifications = [], user, onLogout }) => {
  const [showAddList, setShowAddList] = useState(false)
  const [editingList, setEditingList] = useState(null)
  const [newListName, setNewListName] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')

  const availableColors = [
    { name: 'red', class: 'bg-red-400', label: 'Red' },
    { name: 'blue', class: 'bg-blue-400', label: 'Blue' },
    { name: 'yellow', class: 'bg-yellow-400', label: 'Yellow' },
    { name: 'green', class: 'bg-green-400', label: 'Green' },
    { name: 'purple', class: 'bg-purple-400', label: 'Purple' },
    { name: 'pink', class: 'bg-pink-400', label: 'Pink' },
    { name: 'orange', class: 'bg-orange-400', label: 'Orange' },
    { name: 'gray', class: 'bg-gray-400', label: 'Gray' }
  ]

  const today = new Date().toISOString().split('T')[0]
  
  const todayTasksCount = tasks.filter(task => 
    task.dueDate === today && !task.completed
  ).length

  const upcomingTasksCount = tasks.filter(task => 
    new Date(task.dueDate) >= new Date() && !task.completed
  ).length

  const unreadNotifications = notifications.filter(n => !n.read).length

  const menuItems = [
    { id: 'upcoming', name: 'Upcoming', icon: ChevronRight },
    { id: 'today', name: 'Today', icon: CheckSquare },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'sticky-wall', name: 'Sticky Wall', icon: StickyNote },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ]

  const getListColor = (color) => {
    const colors = {
      red: 'bg-red-400',
      blue: 'bg-blue-400', 
      yellow: 'bg-yellow-400',
      green: 'bg-green-400',
      purple: 'bg-purple-400',
      pink: 'bg-pink-400',
      orange: 'bg-orange-400',
      gray: 'bg-gray-400'
    }
    return colors[color] || 'bg-gray-400'
  }

  const handleAddList = () => {
    if (newListName.trim()) {
      addList(newListName.trim(), selectedColor)
      setNewListName('')
      setSelectedColor('blue')
      setShowAddList(false)
    }
  }

  const handleCancelAddList = () => {
    setShowAddList(false)
    setNewListName('')
    setSelectedColor('blue')
  }

  return (
    <div className="w-80 bg-gray-100 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Menu
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Close sidebar"
          >
            <div className="flex flex-col gap-1">
              <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
              <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
              <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
            </div>
          </button>
        </div>
        
        {/* User Profile Section */}
        {user && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Tasks Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
            TASKS
          </h2>
          <div className="space-y-2">
            {menuItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors ${
                    currentView === item.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Lists Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
            LISTS
          </h2>
          <div className="space-y-2">
            {lists.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No lists yet</p>
                <p className="text-xs text-gray-400 mt-1">Create your first list</p>
              </div>
            ) : (
              lists.map((list, index) => {
              const listTaskCount = tasks.filter(task => task.list === list.name).length
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedList(list.name)
                    setCurrentView('list')
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    currentView === 'list' && selectedList === list.name
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getListColor(list.color)}`}></div>
                    <span className="font-medium text-gray-700">{list.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {listTaskCount}
                  </span>
                </button>
              )
              })
            )}
            
            {showAddList ? (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
                  autoFocus
                />
                
                {/* Color Picker */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Choose Color:</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-6 h-6 rounded-full ${color.class} border-2 transition-all ${
                          selectedColor === color.name 
                            ? 'border-gray-600 scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={handleCancelAddList}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddList}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddList(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} />
                <span className="font-medium">Add New List</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar