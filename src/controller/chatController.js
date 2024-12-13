const catchAsync = require("../utils/catchAsync");
const chatService = require("../services/chatServices");

const getMembers = catchAsync(async (req, res) => {
  const data = await chatService.getMembers(req);
  res.status(200).send(data);
});

const createChats = catchAsync(async (req, res) => {
  const data = await chatService.createChats(req);
  res.status(200).send(data);
});

const getMessaages = catchAsync(async (req, res) => {
    const data = await chatService.getMessaages(req);
    res.status(200).send(data);
  });

module.exports = {
  getMembers,
  createChats,
  getMessaages
};
