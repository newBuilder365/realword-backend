const Service = require('egg').Service

class ArticleService extends Service {

  get Article() {
    return this.app.model.Article
}
  async createArticel(data) {
    
    const article = new this.Article(data)
    await article.save()
    return article
}

}

module.exports = ArticleService;