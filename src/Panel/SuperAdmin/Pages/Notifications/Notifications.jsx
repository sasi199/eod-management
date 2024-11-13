import React from 'react'



const Notifications = () => {

    const notifications = [
        {
          id: 1,
          type: 'message',
          icon: 'fas fa-bell',
          title: 'You have a new message from the admin.',
          time: '2 hours ago',
          color: 'bg-blue-500',
        },
        {
          id: 2,
          type: 'success',
          icon: 'fas fa-check-circle',
          title: 'Your profile has been updated successfully.',
          time: '3 hours ago',
          color: 'bg-green-500',
        },
        {
          id: 3,
          type: 'error',
          icon: 'fas fa-exclamation-circle',
          title: 'There was an issue with your recent order.',
          time: '5 hours ago',
          color: 'bg-red-500',
        },
        {
          id: 4,
          type: 'alert',
          icon: 'fas fa-info-circle',
          title: 'A new update is available for your app.',
          time: '1 day ago',
          color: 'bg-yellow-500',
        },
      ]
  return (
    <div className="w-full  mx-auto  px-4 bg-white shadow-lg rounded-lg">

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200 ease-in-out"
          >
            <div className={`w-12 h-12 ${notification.color} rounded-full flex items-center justify-center text-white mr-4`}>
              <i className={notification.icon}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{notification.title}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
