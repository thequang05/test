import { useState, useEffect } from 'react'
import { Plus, ChevronRight, Calendar, X, Menu, Search } from 'lucide-react'

const UpcomingView = ({ tasks, addTask, updateTask, deleteTask, lists, sidebarOpen, setSidebarOpen }) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  // Get today's date string for initial state
  const getTodayString = () => new Date().toISOString().split('T')[0]
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    list: 'Personal',
    dueDate: getTodayString(),
    time: '09:00',
    completed: false,
    isRecurring: false,
    recurringType: 'daily',
    recurringEndDate: ''
  })
  const [editingTask, setEditingTask] = useState(null)
  const [currentSection, setCurrentSection] = useState('today')

  // Update newTask list when lists change
  useEffect(() => {
    if (lists.length > 0 && !lists.find(list => list.name === newTask.list)) {
      setNewTask(prev => ({
        ...prev,
        list: lists[0].name
      }))
    }
  }, [lists])

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const thisMonth = new Date(today)
  thisMonth.setMonth(today.getMonth() + 1)

  // Get current date strings for filtering
  const todayStr = today.toISOString().split('T')[0]
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  // Check if task is overdue
  const isTaskOverdue = (task) => {
    if (task.completed) return false
    const now = new Date()
    const taskDateTime = new Date(`${task.dueDate}T${task.time || '23:59'}:00`)
    return now > taskDateTime
  }

  const sortTasksByDeadline = (taskList) => {
    return taskList.sort((a, b) => {
      // Sort by completion status first (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      
      // Then sort by overdue status (overdue first)
      const aOverdue = isTaskOverdue(a)
      const bOverdue = isTaskOverdue(b)
      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1
      }
      
      // Finally sort by time
      const timeA = a.time || '23:59'
      const timeB = b.time || '23:59'
      return timeA.localeCompare(timeB)
    })
  }

  const todayTasks = sortTasksByDeadline(
    tasks.filter(task => {
      const matchesDate = task.dueDate === todayStr
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesDate && matchesSearch
    })
  )

  const tomorrowTasks = sortTasksByDeadline(
    tasks.filter(task => {
      const matchesDate = task.dueDate === tomorrowStr
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesDate && matchesSearch
    })
  )

  const thisMonthTasks = sortTasksByDeadline(
    tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      const matchesDate = taskDate > tomorrow && taskDate <= thisMonth
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesDate && matchesSearch
    })
  )

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask({
        ...newTask,
        id: Date.now()
      })
      setNewTask({
        title: '',
        description: '',
        list: 'Personal',
        dueDate: new Date().toISOString().split('T')[0],
        time: '09:00',
        completed: false,
        isRecurring: false,
        recurringType: 'daily',
        recurringEndDate: ''
      })
      setShowAddTaskModal(false)
    }
  }

  const closeAddTaskModal = () => {
    setShowAddTaskModal(false)
    setNewTask({
      title: '',
      description: '',
      list: 'Personal',
      dueDate: todayStr,
      time: '09:00',
      completed: false,
      isRecurring: false,
      recurringType: 'daily',
      recurringEndDate: ''
    })
  }

  const openAddTaskModal = (section) => {
    setCurrentSection(section)
    let defaultDate = todayStr
    if (section === 'tomorrow') {
      defaultDate = tomorrowStr
    } else if (section === 'month') {
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      defaultDate = nextWeek.toISOString().split('T')[0]
    }
    setNewTask({
      title: '',
      description: '',
      list: 'Personal',
      dueDate: defaultDate,
      time: '09:00',
      completed: false,
      isRecurring: false,
      recurringType: 'daily',
      recurringEndDate: ''
    })
    setShowAddTaskModal(true)
  }

  const openEditTaskModal = (task) => {
    setEditingTask({
      ...task,
    })
    setShowEditTaskModal(true)
  }

  const handleEditTask = () => {
    if (editingTask && editingTask.title.trim()) {
      updateTask(editingTask.id, editingTask)
      setShowEditTaskModal(false)
      setEditingTask(null)
    }
  }

  const closeEditTaskModal = () => {
    setShowEditTaskModal(false)
    setEditingTask(null)
  }

  const handleDeleteTask = () => {
    if (editingTask && deleteTask) {
      deleteTask(editingTask.id)
      setShowEditTaskModal(false)
      setEditingTask(null)
    }
  }

  const getListColor = (listName) => {
    const list = lists.find(l => l.name === listName)
    if (list && list.color) {
      // Map color names to Tailwind classes
      const colorMap = {
        'red': 'bg-red-400',
        'blue': 'bg-blue-400', 
        'yellow': 'bg-yellow-400',
        'green': 'bg-green-400',
        'purple': 'bg-purple-400',
        'pink': 'bg-pink-400',
        'indigo': 'bg-indigo-400',
        'gray': 'bg-gray-400'
      }
      return colorMap[list.color] || 'bg-gray-400'
    }
    return 'bg-gray-400'
  }

  const TaskSection = ({ title, tasks, sectionKey }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      
      {/* Add New Task */}
      <button
        onClick={() => openAddTaskModal(sectionKey)}
        className="flex items-center gap-3 mb-4 p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors w-full text-left"
      >
        <Plus size={20} className="text-gray-400" />
        <span className="text-gray-700">Add New Task</span>
      </button>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks for this period yet.</p>
            <p className="text-sm mt-2">Click "Add New Task" to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:border-gray-300 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={(e) => {
                  if (updateTask) {
                    updateTask(task.id, { completed: e.target.checked })
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                  {task.time && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {task.time}
                    </span>
                  )}
                  {isTaskOverdue(task) && (
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-medium">
                      Overdue
                    </span>
                  )}
                  {task.isRecurring && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                      {task.recurringType}
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{task.dueDate}</span>
                </div>
              )}
              {task.subtasks && (
                <span className="text-sm text-gray-500">
                  {task.subtasks} Subtasks
                </span>
              )}
              <div className={`w-3 h-3 rounded-full ${getListColor(task.list)}`}></div>
              <span className="text-sm text-gray-500">{task.list}</span>
              <button
                onClick={() => openEditTaskModal(task)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-2">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">Upcoming</h1>
        </div>
        <span className="text-lg text-gray-600">
          {todayTasks.filter(t => !t.completed).length + tomorrowTasks.filter(t => !t.completed).length + thisMonthTasks.filter(t => !t.completed).length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <TaskSection 
            title="Today" 
            tasks={todayTasks} 
            sectionKey="today"
          />
          
          <TaskSection 
            title="Tomorrow" 
            tasks={tomorrowTasks} 
            sectionKey="tomorrow"
          />
          
          <TaskSection 
            title="This Month" 
            tasks={thisMonthTasks} 
            sectionKey="month"
          />
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white w-96 h-full shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
                <button
                  onClick={closeAddTaskModal}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Task Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add description..."
                />
              </div>

              {/* List */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List
                </label>
                <select
                  value={newTask.list}
                  onChange={(e) => setNewTask({...newTask, list: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {lists.map((list) => (
                    <option key={list.name} value={list.name}>{list.name}</option>
                  ))}
                </select>
              </div>

              {/* Due Date and Time */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Recurring Task Options */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={newTask.isRecurring}
                    onChange={(e) => setNewTask({...newTask, isRecurring: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700">
                    Recurring Task
                  </label>
                </div>

                {newTask.isRecurring && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recurring Type
                      </label>
                      <select
                        value={newTask.recurringType}
                        onChange={(e) => setNewTask({...newTask, recurringType: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={newTask.recurringEndDate}
                        onChange={(e) => setNewTask({...newTask, recurringEndDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeAddTaskModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white w-96 h-full shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
                <button
                  onClick={closeEditTaskModal}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Task Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add description..."
                />
              </div>

              {/* List */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List
                </label>
                <select
                  value={editingTask.list}
                  onChange={(e) => setEditingTask({...editingTask, list: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {lists.map((list) => (
                    <option key={list.name} value={list.name}>{list.name}</option>
                  ))}
                </select>
              </div>

              {/* Due Date and Time */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editingTask.time || ''}
                    onChange={(e) => setEditingTask({...editingTask, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Recurring Task Options */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsRecurring"
                    checked={editingTask.isRecurring || false}
                    onChange={(e) => setEditingTask({...editingTask, isRecurring: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsRecurring" className="ml-2 block text-sm font-medium text-gray-700">
                    Recurring Task
                  </label>
                </div>

                {(editingTask.isRecurring || false) && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recurring Type
                      </label>
                      <select
                        value={editingTask.recurringType || 'daily'}
                        onChange={(e) => setEditingTask({...editingTask, recurringType: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={editingTask.recurringEndDate || ''}
                        onChange={(e) => setEditingTask({...editingTask, recurringEndDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete Task
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={closeEditTaskModal}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditTask}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpcomingView
