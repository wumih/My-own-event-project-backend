//这个是实现发布新文章的模块
// 导入 express
const express = require("express");
// 导入 multer 用于解析 multipart/form-data 数据
const multer = require("multer");
// 导入 path 用于处理文件路径
const path = require("path");

// 创建路由对象
const router = express.Router();
// 导入文章的路由处理函数模块
const article_handler = require("../router_handler/article");
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入文章的验证模块
const { add_article_schema } = require("../schema/article");

// 创建 multer 的实例，配置上传文件的存放路径
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// 发布新文章的路由
router.post(
  "/add",
  upload.single("cover_img"),
  expressJoi(add_article_schema),
  article_handler.addArticle
);

// 向外共享路由对象
module.exports = router;
