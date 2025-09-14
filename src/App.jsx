import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import CalendarView from './components/CalendarView'
import TodayView from './components/TodayView'
import UpcomingView from './components/UpcomingView'
import StickyWall from './components/StickyWall'
import ListView from './components/ListView'
import NotificationsView from './components/NotificationsView'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  // Authentication state
  const [user, setUser] = useState(null)
  const [authView, setAuthView] = useState('login') // 'login' or 'register'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const [currentView, setCurrentView] = useState('calendar')
  const [selectedList, setSelectedList] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Default tasks with notification fields
  const defaultTasks = [
    {
      id: 1,
      title: 'Research content ideas',
      description: 'Research and brainstorm new content ideas for blog posts and social media',
      completed: false,
      list: 'Personal',
      dueDate: '2025-09-14',
      time: '09:00',
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 2,
      title: 'Create a database of guest authors',
      description: 'Compile a list of potential guest authors for upcoming blog posts',
      completed: false,
      list: 'Personal',
      dueDate: '2025-09-14',
      time: '14:00',
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 3,
      title: 'Renew driver\'s license',
      description: 'Visit DMV to renew driver\'s license before expiration',
      completed: false,
      list: 'Personal',
      dueDate: '2025-09-15',
      time: '11:00',
      subtasks: 1,
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 4,
      title: 'Consult accountant',
      description: 'Meet with accountant to discuss tax preparation and business finances',
      completed: false,
      list: 'List 1',
      dueDate: '2025-09-21',
      time: '10:00',
      subtasks: 3,
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 5,
      title: 'Print business card',
      description: 'Design and print new business cards with updated information',
      completed: false,
      list: 'Work',
      dueDate: '2025-09-14',
      time: '16:00',
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 6,
      title: 'Team standup meeting',
      description: 'Daily standup with the development team',
      completed: false,
      list: 'Work',
      dueDate: '2025-09-14',
      time: '09:30',
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 7,
      title: 'Coffee break',
      description: 'Take a short break and grab coffee',
      completed: true,
      list: 'Personal',
      dueDate: '2025-09-14',
      time: '14:15',
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 8,
      title: 'Review code',
      description: 'Review pull requests from team members',
      completed: false,
      list: 'Work',
      dueDate: '2025-09-14',
      time: '14:45',
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    },
    {
      id: 9,
      title: 'Overdue test task',
      description: 'This task is overdue for testing notifications',
      completed: false,
      list: 'Personal',
      dueDate: '2025-09-14',
      time: '08:00',
      notified: false,
      overdueNotified: false,
      isRecurring: false,
      recurringType: '',
      recurringEndDate: ''
    }
  ]

  // Load tasks from localStorage or use default
  const [tasks, setTasks] = useState(() => {
    // Initially load without user context, will be updated when user logs in
    return []
  })

  const [events, setEvents] = useState([])

  // Load lists from localStorage
  const [lists, setLists] = useState(() => {
    // Initially load without user context, will be updated when user logs in
    return []
  })

  // Load sticky notes from localStorage
  const [stickyNotes, setStickyNotes] = useState(() => {
    // Initially load without user context, will be updated when user logs in
    return []
  })

  const [notifications, setNotifications] = useState([])

  // Helper functions for user-specific data
  const getUserDataKey = (dataType, userId = null) => {
    const id = userId || user?.id
    return id ? `todoApp_${dataType}_${id}` : `todoApp_${dataType}`
  }

  const loadUserData = (dataType, defaultValue, userId = null) => {
    try {
      const key = getUserDataKey(dataType, userId)
      const savedData = localStorage.getItem(key)
      return savedData ? JSON.parse(savedData) : defaultValue
    } catch (error) {
      console.error(`Error loading ${dataType}:`, error)
      return defaultValue
    }
  }

  const saveUserData = (dataType, data, userId = null) => {
    try {
      const key = getUserDataKey(dataType, userId)
      console.log(`Saving ${dataType} for user ${userId} to key: ${key}`)
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving ${dataType}:`, error)
    }
  }

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Clear old global data only once on app startup
        clearOldGlobalDataOnce()
        
        const currentUser = localStorage.getItem('todoApp_currentUser')
        if (currentUser) {
          const userData = JSON.parse(currentUser)
          console.log('Found existing user on app load:', userData.id)
          setUser(userData)
          setIsAuthenticated(true)
          // Load user-specific data
          loadUserSpecificData(userData)
        } else {
          console.log('No existing user found on app load')
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        localStorage.removeItem('todoApp_currentUser')
      }
    }
    
    checkAuth()
  }, [])

  // Clear old global data only once on app startup
  const clearOldGlobalDataOnce = () => {
    const hasCleared = localStorage.getItem('todoApp_clearedOldData')
    if (!hasCleared) {
      console.log('First time app load - clearing old global data...')
      clearOldGlobalData()
      localStorage.setItem('todoApp_clearedOldData', 'true')
    }
  }

  // Authentication functions
  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setAuthView('login')
    
    // Load user-specific data (don't clear other users' data)
    loadUserSpecificData(userData)
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setAuthView('login')
    
    // Load fresh user-specific data (new user gets empty data)
    loadUserSpecificData(userData)
  }

  const clearOldGlobalData = () => {
    // Remove old global data keys that don't have user ID
    const keysToRemove = [
      'todoApp_tasks',
      'todoApp_lists', 
      'todoApp_stickyNotes',
      'todoApp_notifications',
      'todoApp_uiState'
    ]
    
    console.log('Clearing old global data...')
    keysToRemove.forEach(key => {
      const hadData = localStorage.getItem(key)
      if (hadData) {
        console.log('Removing old data from:', key)
        localStorage.removeItem(key)
      }
    })
  }

  const loadUserSpecificData = (userData) => {
    console.log('Loading data for user:', userData.id)
    
    // Load user-specific tasks (empty for new users)
    const userTasks = loadUserData('tasks', [], userData.id)
    console.log('Loaded tasks:', userTasks.length)
    setTasks(userTasks)
    
    // Load user-specific lists (empty for new users)
    const userLists = loadUserData('lists', [], userData.id)
    console.log('Loaded lists:', userLists.length)
    setLists(userLists)
    
    // Load user-specific sticky notes (empty for new users)
    const userStickyNotes = loadUserData('stickyNotes', [], userData.id)
    console.log('Loaded sticky notes:', userStickyNotes.length)
    setStickyNotes(userStickyNotes)
    
    // Load user-specific notifications (empty for new users)
    const userNotifications = loadUserData('notifications', [], userData.id)
    console.log('Loaded notifications:', userNotifications.length)
    setNotifications(userNotifications)
    
    // Load user-specific UI state
    const userUIState = loadUserData('uiState', {
      currentView: 'calendar',
      selectedList: null,
      sidebarOpen: true
    }, userData.id)
    setCurrentView(userUIState.currentView)
    setSelectedList(userUIState.selectedList)
    setSidebarOpen(userUIState.sidebarOpen)
  }

  const handleLogout = () => {
    console.log('Logging out user:', user?.id)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('todoApp_currentUser')
    setCurrentView('calendar')
  }

  const switchAuthView = (view) => {
    setAuthView(view)
  }

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      saveUserData('tasks', tasks, user.id)
    }
  }, [tasks, user])

  // Save lists to localStorage
  useEffect(() => {
    if (user) {
      saveUserData('lists', lists, user.id)
    }
  }, [lists, user])

  // Save sticky notes to localStorage
  useEffect(() => {
    if (user) {
      saveUserData('stickyNotes', stickyNotes, user.id)
    }
  }, [stickyNotes, user])

  // Save notifications to localStorage
  useEffect(() => {
    if (user) {
      saveUserData('notifications', notifications, user.id)
    }
  }, [notifications, user])

  // Save UI state to localStorage
  useEffect(() => {
    if (user) {
      saveUserData('uiState', {
        currentView,
        selectedList,
        sidebarOpen
      }, user.id)
    }
  }, [currentView, selectedList, sidebarOpen, user])

  // Notification functions
  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Simple notification check (1 hour before deadline)
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date()
      
      tasks.forEach(task => {
        if (!task.completed && task.dueDate && task.time) {
          const taskDateTime = new Date(`${task.dueDate}T${task.time}:00`)
          const oneHourBefore = new Date(taskDateTime.getTime() - 60 * 60 * 1000)
          
          // Check for 1 hour reminder (only if not already notified)
          if (now >= oneHourBefore && now < taskDateTime && !task.notified) {
            const message = `Reminder: "${task.title}" is due in 1 hour (${task.time})`
            addNotification(message, 'warning')
            
            // Mark task as notified
            updateTask(task.id, { notified: true })
            
            // Browser notification
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: message,
                icon: '/vite.svg'
              })
            }
          }
          
          // Check for overdue (only if not already notified for overdue)
          if (now > taskDateTime && !task.overdueNotified) {
            const hoursOverdue = Math.floor((now - taskDateTime) / (1000 * 60 * 60))
            const message = hoursOverdue === 0 
              ? `Task overdue: "${task.title}" was due at ${task.time}`
              : `Task overdue: "${task.title}" was due ${hoursOverdue}h ago (${task.time})`
            
            addNotification(message, 'error')
            
            // Mark as overdue notified
            updateTask(task.id, { overdueNotified: true })
            
            // Browser notification
            if (Notification.permission === 'granted') {
              new Notification('Task Overdue!', {
                body: message,
                icon: '/vite.svg'
              })
            }
          }
        }
      })
    }

    // Check immediately when component mounts
    checkNotifications()
    
    // Then check every minute
    const interval = setInterval(checkNotifications, 60000)
    return () => clearInterval(interval)
  }, [tasks])

  // Generate recurring task
  const generateRecurringTask = (originalTask) => {
    const now = new Date()
    let nextDueDate = new Date(originalTask.dueDate)
    
    switch (originalTask.recurringType) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + 1)
        break
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 7)
        break
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1)
        break
      default:
        return null
    }
    
    // Check if we should stop generating (if end date reached)
    if (originalTask.recurringEndDate) {
      const endDate = new Date(originalTask.recurringEndDate)
      if (nextDueDate > endDate) {
        return null
      }
    }
    
    const newTask = {
      ...originalTask,
      id: Date.now() + Math.random(),
      dueDate: nextDueDate.toISOString().split('T')[0],
      completed: false,
      notified: false,
      overdueNotified: false,
      isRecurring: false, // Don't make the new task recurring
      recurringType: '',
      recurringEndDate: ''
    }
    
    return newTask
  }

  // Check for recurring tasks
  useEffect(() => {
    const checkRecurringTasks = () => {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      
      tasks.forEach(task => {
        // Check if task is completed and was due yesterday or earlier
        if (task.completed && task.isRecurring && task.dueDate < today) {
          const taskDueDate = new Date(task.dueDate)
          const yesterday = new Date(now)
          yesterday.setDate(yesterday.getDate() - 1)
          
          // If task was due yesterday or earlier, generate next occurrence
          if (taskDueDate <= yesterday) {
            // Check if we already have a task for the next occurrence
            const nextDueDate = new Date(taskDueDate)
            switch (task.recurringType) {
              case 'daily':
                nextDueDate.setDate(nextDueDate.getDate() + 1)
                break
              case 'weekly':
                nextDueDate.setDate(nextDueDate.getDate() + 7)
                break
              case 'monthly':
                nextDueDate.setMonth(nextDueDate.getMonth() + 1)
                break
              default:
                return
            }
            
            const nextDueDateStr = nextDueDate.toISOString().split('T')[0]
            
            // Check if task already exists for next date
            const existingTask = tasks.find(t => 
              t.title === task.title && 
              t.dueDate === nextDueDateStr && 
              t.list === task.list
            )
            
            if (!existingTask) {
              const newTask = generateRecurringTask(task)
              if (newTask) {
                addTask(newTask)
              }
            }
          }
        }
      })
    }

    // Check immediately when component mounts
    checkRecurringTasks()
    
    // Then check every minute
    const interval = setInterval(checkRecurringTasks, 60000)
    return () => clearInterval(interval)
  }, [tasks])

  // Request notification permission on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const addTask = (task) => {
    setTasks([...tasks, { 
      ...task, 
      id: Date.now(),
      notified: false,
      overdueNotified: false,
      isRecurring: task.isRecurring || false,
      recurringType: task.recurringType || '',
      recurringEndDate: task.recurringEndDate || ''
    }])
  }

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const addList = (listName, color = 'gray') => {
    setLists([...lists, { name: listName, count: 0, color: color }])
  }

  const updateList = (oldName, updates) => {
    setLists(lists.map(list => 
      list.name === oldName ? { ...list, ...updates } : list
    ))
    
    // Update tasks that belong to this list
    if (updates.name && updates.name !== oldName) {
      setTasks(tasks.map(task => 
        task.list === oldName ? { ...task, list: updates.name } : task
      ))
      
      // Update selectedList if it's currently selected
      if (selectedList === oldName) {
        setSelectedList(updates.name)
      }
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView events={events} tasks={tasks} updateTask={updateTask} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      case 'today':
        return <TodayView tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} lists={lists} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      case 'upcoming':
        return <UpcomingView tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} lists={lists} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      case 'sticky-wall':
        return <StickyWall notes={stickyNotes} setStickyNotes={setStickyNotes} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      case 'list':
        return <ListView tasks={tasks.filter(task => task.list === selectedList)} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} listName={selectedList} lists={lists} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      case 'notifications':
        return <NotificationsView notifications={notifications} markNotificationAsRead={markNotificationAsRead} clearNotification={clearNotification} clearAllNotifications={clearAllNotifications} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      default:
        return <CalendarView events={events} tasks={tasks} />
    }
  }

  // Show authentication views if not authenticated
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => switchAuthView('register')} 
      />
    ) : (
      <Register 
        onRegister={handleRegister} 
        onSwitchToLogin={() => switchAuthView('login')} 
      />
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          tasks={tasks}
          lists={lists}
          addList={addList}
          updateList={updateList}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          notifications={notifications}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App