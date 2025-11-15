// 导入处理路径的核心模块
const path = require("path");
// 导入数据库操作模块
const db = require("../db/index");

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
  // 注意：因为 multer 是在路由层面配置的，所以这里不再需要手动判断 req.file
  // 如果客户端未提供名为 'cover_img' 的文件，multer 会处理并且请求不会到达这里。
  // 同时，Joi 验证也确保了其他 body 字段的合法性。
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("文章封面是必选参数！");

  // 1. 整理要插入数据库的文章信息对象
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join("/uploads", req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id (此 id 来自于 token 解析)
    author_id: req.user.id,
  };

  // 2. 定义发布文章的 SQL 语句
  const sql = `insert into ev_articles set ?`;

  // 3. 调用 db.query() 执行 SQL 语句
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("发布文章失败！");

    res.cc("发布文章成功！", 0);
  });
};
