package com.devmountain.nlpApp.dtos;

import com.devmountain.nlpApp.entities.Article;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDto {
    private Long id;
    private String title;
    private String body;
    private String link;
    private Integer relevance;
    private LocalDateTime created;
    private LocalDateTime updated;
    private User user;
    private Category category;
    private String imageData;

    public ArticleDto(Article article) {
        if (article.getId() != null) {
            this.id = article.getId();
        }
        if (article.getTitle() != null) {
            this.link = article.getTitle();
        }
        if (article.getBody() != null) {
            this.body = article.getBody();
        }
        if (article.getLink() != null) {
            this.link = article.getLink();
        }
        if (article.getRelevance() != null) {
            this.relevance = article.getRelevance();
        }
        if (article.getCreated() != null) {
            this.created = article.getCreated();
        }
        if (article.getUpdated() != null) {
            this.updated = article.getUpdated();
        }
        if (article.getImageData() != null) {
            this.imageData = article.getImageData();
        }
    }
}
