package com.devmountain.nlpApp.dtos;

import com.devmountain.nlpApp.entities.Article;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;


// The ArticleDto class is a data transfer object (DTO) class.
// It is used to transfer data related to a article between different layers of an application,
// such as between the controller and service layers or between the service and data access layers

// @Data annotation is provided by the Lombok library and is used to automatically generate
// getter and setter methods, toString(), equals(), and hashCode() methods, and other boilerplate code.
@Data
// @AllArgsConstructor annotation is provided by Lombok and generates a constructor with parameters
// for all fields in the class.
@AllArgsConstructor
// This annotation is provided by Lombok and generates a no-argument constructor for the class.
@NoArgsConstructor
public class ArticleDto {
    private Long id;
    private String title;
    private String body;
    private String link;
    private Integer relevance;
    private Date created;
    private User user;
    private Category category;

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
    }
}
