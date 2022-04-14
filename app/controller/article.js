const Controller = require("egg").Controller;

class ArticleController extends Controller {
  // 创建文章
  async createArticel() {
    const body = this.ctx.request.body
    this.ctx.validate({
      title: { type: "string" },
      description: { type: 'string' },
      body: { type: 'string' },
      // tagList: { type: "string[]" }
    }, body)
    const user = this.ctx.user
    const articleService = this.service.article;
    body.author = user._id
    const article = await articleService.createArticel(body)
    this.ctx.body = {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        favorited: article.favorited,
        favoritesCount: article.favoritesCount
      }
    }
  }

  // 获取所有文章
  async getAllArticle() {
    const { Article } = this.app.model
    // const body = this.ctx.body.request
    let { pageNum = 1, pageSize = 10 } = this.ctx.query
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)
    const getAllArticle = Article
      .find()
      .populate('author')
      .sort({
        createdAt: -1
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      const getArticleCount = Article.countDocuments()
      const [articles, articlesCount] = await Promise.all([
        getAllArticle,
        getArticleCount
      ])
      this.ctx.body = {
        articles,
        articlesCount
      }
  }
}

module.exports = ArticleController;
