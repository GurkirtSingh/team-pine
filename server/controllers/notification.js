const Notification = require("../models/Notification");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @route POST /notification/
// @desc create a new notification
// @access Public

exports.createNotification = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { type, title, description } = req.body;
  const notification = await Notification.create({
    user,
    type,
    title,
    description,
  });

  res.status(200).json({
    success: {
      notification: notification,
    },
  });
});

// @route PUT /notification/mark-read/:notificationId
// @desc changes mark as read property to true on a notification
// @access Private

exports.markAsRead = asyncHandler(async (req, res, next) => {
  const { notificationId } = req.params;
  const foundNotification = await Notification.findById(notificationId);

  if (foundNotification.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden");
  }

  foundNotification.read = true;

  await foundNotification.save();

  res.status(200).json({
    success: {
      notification: foundNotification,
    },
  });
});

// @route POST /notification/all
// @desc Retrieves all notifications for a user
// @access Private

exports.retrieveUsersNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const foundNotifications = await Notification.find({ user: userId });

  res.status(200).json({
    success: {
      notifications: foundNotifications,
    },
  });
});

// @route POST /notification/unread
// @desc Retrieves all unread notifications for a user
// @access Private

exports.retrieveUsersUnreadNotifications = asyncHandler(
  async (req, res, next) => {
    const userId = req.user.id;
    const foundNotifications = await Notification.find({
      user: userId,
      read: false,
    });

    res.status(200).json({
      success: {
        notifications: foundNotifications,
      },
    });
  }
);
