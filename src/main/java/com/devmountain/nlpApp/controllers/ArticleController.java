package com.devmountain.nlpApp.controllers;

import com.devmountain.nlpApp.dtos.ArticleDto;
import com.devmountain.nlpApp.services.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("api/v1/articles")
public class ArticleController {
    @Autowired
    private ArticleService articleService;
    @GetMapping("/user/{userId}")
    public List<ArticleDto> getArticlesByUser(@PathVariable Long userId){
        return articleService.getAllArticlesByUserId(userId);
    }

    // This annotation maps the HTTP POST requests with the URL pattern /api/v1/articles/user/body/{userId}
    // to the getArticlesByBody() method.It retrieves a list of ArticleDto objects based on the provided request body and user ID.
    @PostMapping("/user/body/{userId}")
    public List<ArticleDto> getArticlesByBody(@RequestBody(required = false) String body, @PathVariable Long userId){
        return articleService.getAllArticlesByBody(body, userId);
    }

    @PostMapping("/user/nlp/body")
    public Object getNlpCategory(@RequestBody String body){
        return articleService.getNlpCategory(body);
    }

    // This annotation maps the HTTP GET requests with the URL pattern /api/v1/articles/{articleId} to the getArticleById() method.
    // It retrieves a single ArticleDto object based on the provided article ID
    @GetMapping("/{articleId}") // http://localhost:8080/api/v1/article/user/1
    public Optional<ArticleDto> getArticleById(@PathVariable Long articleId){
        return articleService.getArticleById(articleId);
    }

    // This annotation maps the HTTP POST requests with the URL pattern /api/v1/articles/user/{userId} to the addArticle() method.
    // It adds a new article by accepting an ArticleDto object in the request body and associating it with the specified user ID.
    @PostMapping(value = "/user/{userId}")
    public void addArticle(@RequestBody ArticleDto articleDto, @PathVariable Long userId) {
        articleService.addArticle(articleDto, userId);
    }

    //  This annotation maps the HTTP DELETE requests with the URL pattern /api/v1/articles/{articleId} to the deleteArticleById() method.
    //  It deletes an article based on the provided article ID.
    @DeleteMapping("/{articleId}")
    public void deleteArticleById(@PathVariable Long articleId){
        articleService.deleteArticleById(articleId);
    }

    // This annotation maps the HTTP PUT requests with the URL pattern /api/v1/articles to the updateArticle() method.
    // It updates an existing article by accepting an ArticleDto object in the request body.
    @PutMapping //http://localhost:8080/api/v1/articles
    public void updateArticle(@RequestBody ArticleDto articleDto){
        articleService.updateArticleById(articleDto);
    }
}