const express = require("express");

const router = express.Router();

// 旧项目
// router.use("/wxmini", require("./wxmini"));
// router.use("/userinfo", require("./userinfo"));
// router.use("/violate", require("./violate"));
// router.use("/road", require("./road"));
// router.use("/web", require("./web"));
// router.use('/qq', require('./qq'))

router.use("/disaster", require("./disaster"));
router.use("/wxMiniApi", require("./wxMiniApi"));

module.exports = router;
