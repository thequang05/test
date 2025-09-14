import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Menu } from 'lucide-react'

const CalendarView = ({ events, tasks, updateTask, sidebarOpen, setSidebarOpen }) => {
  const [currentDate, setCurrentDate] = useState(new Date()) // Current date

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatTime = (time) => {
    const [hour, minute] = time.split(':')
    const hourInt = parseInt(hour)
    const ampm = hourInt >= 12 ? 'PM' : 'AM'
    const displayHour = hourInt > 12 ? hourInt - 12 : hourInt === 0 ? 12 : hourInt
    return `${displayHour}:${minute} ${ampm}`
  }

  // Check if task is overdue
  const isTaskOverdue = (task) => {
    if (task.completed) return false
    const now = new Date()
    const taskDateTime = new Date(`${task.dueDate}T${task.time || '23:59'}:00`)
    return now > taskDateTime
  }

  const timeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ]

  const getItemsForTime = (timeSlot) => {
    const currentDateStr = currentDate.toISOString().split('T')[0]
    const timeSlotHour = timeSlot.split(':')[0]
    
    // Get events for this time slot
    const event = events.find(event => {
      const eventTime = event.time ? event.time.replace(' AM', '').replace(' PM', '') : null
      let normalizedEventTime = eventTime
      if (eventTime && eventTime.includes(':')) {
        const [hour, minute] = eventTime.split(':')
        if (event.time.includes('PM') && hour !== '12') {
          normalizedEventTime = (parseInt(hour) + 12).toString().padStart(2, '0') + ':' + minute
        } else if (event.time.includes('AM') && hour === '12') {
          normalizedEventTime = '00:' + minute
        } else {
          normalizedEventTime = hour.padStart(2, '0') + ':' + minute
        }
      }
      return normalizedEventTime === timeSlot && event.date === currentDateStr
    })
    
    // Get tasks for this time slot hour (show all tasks that fall within this hour)
    const tasksForTime = tasks.filter(task => {
      if (!task.time || task.dueDate !== currentDateStr) return false
      
      const taskHour = task.time.split(':')[0]
      return taskHour === timeSlotHour
    })
    
    return { event, tasks: tasksForTime }
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1)
    } else {
      newDate.setDate(currentDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
            )}
            <h1 className="text-2xl font-semibold text-gray-900">
              {formatDate(currentDate)}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-6">
          <div className="space-y-1">
            {timeSlots.map((time) => {
              const { event, tasks: tasksForTime } = getItemsForTime(time)
              return (
                <div key={time} className="flex items-start gap-4 py-2 border-b border-gray-100 last:border-b-0">
                  <div className="w-20 text-sm text-gray-500 font-medium flex-shrink-0">
                    {formatTime(time)}
                  </div>
                  <div className="flex-1 relative space-y-2">
                    {event && (
                      <div className={`p-3 rounded-md ${
                        event.type === 'meeting' 
                          ? 'bg-light-blue border-l-4 border-blue-400' 
                          : 'bg-light-pink border-l-4 border-pink-400'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                        </div>
                      </div>
                    )}
                    {tasksForTime.map((task) => (
                      <div key={task.id} className={`p-3 rounded-md border-l-4 ${
                        task.completed 
                          ? 'bg-green-50 border-green-400' 
                          : task.list === 'Personal' 
                            ? 'bg-red-50 border-red-400'
                            : task.list === 'Work'
                              ? 'bg-blue-50 border-blue-400'
                              : 'bg-yellow-50 border-yellow-400'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => {
                              if (updateTask) {
                                updateTask(task.id, { completed: e.target.checked })
                              }
                            }}
                            className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <h3 className={`font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          {task.time && (
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full ml-auto">
                              {formatTime(task.time)}
                            </span>
                          )}
                          {isTaskOverdue(task) && (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-medium ml-2">
                              Overdue
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 ml-5">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 ml-5">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {task.list}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Day Label */}
      <div className="bg-gray-50 px-6 py-2 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-600">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export default CalendarView
