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

    @PostMapping("/user/body/{userId}")
    public List<ArticleDto> getArticlesByBody(@RequestBody(required = false) String body, @PathVariable Long userId){
        return articleService.getAllArticlesByBody(body, userId);
    }

    @PostMapping("/user/nlp/body")
    public Object getNlpCategory(@RequestBody String body){
        return articleService.getNlpCategory(body);
    }

    @GetMapping("/{articleId}") // http://localhost:8080/api/v1/article/user/1
    public Optional<ArticleDto> getArticleById(@PathVariable Long articleId){
        return articleService.getArticleById(articleId);
    }

    @PostMapping(value = "/user/{userId}")
    public void addArticle(@RequestBody ArticleDto articleDto, @PathVariable Long userId) {
        articleService.addArticle(articleDto, userId);
    }

    @DeleteMapping("/{articleId}")
    public void deleteArticleById(@PathVariable Long articleId){
        articleService.deleteArticleById(articleId);
    }

    @PutMapping //http://localhost:8080/api/v1/articles
    public void updateArticle(@RequestBody ArticleDto articleDto){
        articleService.updateArticleById(articleDto);
    }
}