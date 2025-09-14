import { useState, useEffect } from 'react'
import { Plus, ChevronRight, Calendar, User, X, Menu, Search } from 'lucide-react'

const TodayView = ({ tasks, addTask, updateTask, deleteTask, lists, sidebarOpen, setSidebarOpen }) => {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newTask, setNewTask] = useState({
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

  // Update newTask list when lists change
  useEffect(() => {
    if (lists.length > 0 && !lists.find(list => list.name === newTask.list)) {
      setNewTask(prev => ({
        ...prev,
        list: lists[0].name
      }))
    }
  }, [lists])

  // Check if task is overdue
  const isTaskOverdue = (task) => {
    if (task.completed) return false
    const now = new Date()
    const taskDateTime = new Date(`${task.dueDate}T${task.time || '23:59'}:00`)
    return now > taskDateTime
  }

  const todayTasks = tasks
    .filter(task => {
      const today = new Date().toISOString().split('T')[0]
      const matchesDate = task.dueDate === today
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesDate && matchesSearch
    })
    .sort((a, b) => {
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
      dueDate: new Date().toISOString().split('T')[0],
      time: '09:00',
      completed: false
    })
  }

  const openTaskModal = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const closeTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  const handleSaveTask = () => {
    if (selectedTask) {
      updateTask(selectedTask.id, selectedTask)
      closeTaskModal()
    }
  }

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id)
      closeTaskModal()
    }
  }

  const openEditTaskModal = (task) => {
    setEditingTask({...task})
    setShowEditTaskModal(true)
  }

  const closeEditTaskModal = () => {
    setShowEditTaskModal(false)
    setEditingTask(null)
  }

  const handleUpdateTask = () => {
    if (editingTask) {
      updateTask(editingTask.id, editingTask)
      closeEditTaskModal()
    }
  }

  const handleDeleteTaskFromEdit = () => {
    if (editingTask) {
      deleteTask(editingTask.id)
      closeEditTaskModal()
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">Today</h1>
        </div>
        <span className="text-lg text-gray-600">
          {todayTasks.length} tasks
          {searchTerm && ` (filtered)`}
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

          {/* Add New Task */}
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-3 mb-6 p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors w-full text-left"
          >
            <Plus size={20} className="text-gray-400" />
            <span className="text-gray-700">Add New Task</span>
          </button>

          {/* Tasks List */}
          <div className="space-y-3">
            {todayTasks.length === 0 && searchTerm && (
              <div className="text-center py-12 text-gray-500">
                <p>No tasks found matching "{searchTerm}"</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            )}
            {todayTasks.length === 0 && !searchTerm && (
              <div className="text-center py-12 text-gray-500">
                <p>No tasks for today yet.</p>
                <p className="text-sm mt-2">Click "Add New Task" to get started!</p>
              </div>
            )}
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:border-gray-300 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      updateTask(task.id, { completed: e.target.checked })
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
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{task.dueDate}</span>
                  </div>
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
            ))}
          </div>
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

              {/* Recurring Task */}
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={newTask.isRecurring}
                    onChange={(e) => setNewTask({...newTask, isRecurring: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Recurring Task</span>
                </label>
                
                {newTask.isRecurring && (
                  <div className="space-y-4 ml-6 p-4 bg-gray-50 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repeat
                      </label>
                      <select
                        value={newTask.recurringType}
                        onChange={(e) => setNewTask({...newTask, recurringType: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (optional)
                      </label>
                      <input
                        type="date"
                        value={newTask.recurringEndDate}
                        onChange={(e) => setNewTask({...newTask, recurringEndDate: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {/* Task Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white w-96 h-full shadow-xl overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
                <button
                  onClick={closeTaskModal}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>


              {/* Task Title */}
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                className="w-full text-lg font-medium text-gray-900 bg-transparent border-none focus:outline-none mb-6"
              />

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
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
                  value={selectedTask.list}
                  onChange={(e) => setSelectedTask({...selectedTask, list: e.target.value})}
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
                    Due date
                  </label>
                  <input
                    type="date"
                    value={selectedTask.dueDate}
                    onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={selectedTask.time || '09:00'}
                    onChange={(e) => setSelectedTask({...selectedTask, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>



              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete Task
                </button>
                <button
                  onClick={handleSaveTask}
                  className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium"
                >
                  Save changes
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
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
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

                <div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
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
                    onClick={handleDeleteTaskFromEdit}
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
                      onClick={handleUpdateTask}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Update Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodayView
