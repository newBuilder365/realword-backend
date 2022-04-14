'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth()
  router.prefix('/api')  // 设置基础路径
  // 注册
  router.post('/users', controller.user.create)
  // 登陆
  router.post('/users/login', controller.user.login)
  // 获取当前用户信息
  router.get('/user', auth, controller.user.getCurrentUser)
  // 更新用户信息
  router.put('/user', auth, controller.user.update)
  // 获取用户信息
  router.get('/users/:userId', app.middleware.auth({ isRequired: false }), controller.user.getUser)

  // 用户订阅
  router.post('/users/:userId/subscribe', auth, controller.user.subscribe)
  // 取消用户订阅
  router.delete('/users/:userId/subscribe', auth, controller.user.unsubscribe)
  // 获取用户订阅的数据
  router.get('/users/:userId/subscriptions', controller.user.getSubscriptions)
  
  // 创建文章
  router.post('/articles', auth, controller.article.createArticel)
  // 获取所有文章
  router.get('/articles', controller.article.getAllArticle)

  // 根据用户名查询用户信息
  router.get('/profiles/:username', controller.user.getUserInfoByName)

};

