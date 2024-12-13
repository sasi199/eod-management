const crypto = require("crypto");

const generateFolderId = (userName) => {
    const nameHash = crypto
      .createHash("md5")
      .update(userName)
      .digest("hex")
      .slice(0, 6);
    const timestamp = Date.now().toString(36);
    return `${nameHash}${timestamp}`;
  };

  
  module.exports = generateFolderId;