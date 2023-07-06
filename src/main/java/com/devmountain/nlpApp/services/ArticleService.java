package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.ArticleDto;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ArticleService {
    List<ArticleDto> getAllArticlesByUserId(Long userId);

    Object getNlpCategory(String body);

    List<ArticleDto> getAllArticlesByBody(String body, Long userId);

    @Transactional
    void addArticle(ArticleDto articleDto, Long userId);

    @Transactional
    void deleteArticleById(Long ArticleId);

    @Transactional
    void updateArticleById(ArticleDto articleDto);

    Optional<ArticleDto> getArticleById(Long ArticleId);

}