package com.devmountain.nlpApp.entities;
import com.devmountain.nlpApp.dtos.ArticleDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;

// The Article class is an entity class in the Spring Framework.
// It represents an article entity that can be stored and retrieved from a database.

// @Entity annotation is used to indicate that the class is an entity and should be mapped to a database table.
@Entity
// @Table(name = "Articles"): This annotation specifies the name of the database table to which the entity is mapped.
@Table(name = "Articles")
// @Data annotation is provided by the Lombok library and is used to automatically generate getter and setter methods,
// toString(), equals(), and hashCode() methods, and other boilerplate code.
@Data
// @AllArgsConstructor annotation is provided by Lombok and generates a constructor with parameters
// for all fields in the class.
@AllArgsConstructor
// This annotation is provided by Lombok and generates a no-argument constructor for the class.
@NoArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text")
    private String title;

    @Column(columnDefinition = "text")
    private String body;

    @Column(columnDefinition = "text")
    private String link;

    @Column(columnDefinition = "integer")
    private Integer relevance;

    @LastModifiedDate
    @Column(name = "created", nullable = false)
    private LocalDateTime created;

    @LastModifiedDate
    @Column(name = "updated")
    private LocalDateTime updated;

    @ManyToOne
    @JsonBackReference(value="user")
    private User user;

    @ManyToOne
    @JsonBackReference(value="category")
    private Category category;

    @Column(columnDefinition = "text")
    private String imageData;

    public Article(ArticleDto articleDto){
        if (articleDto.getId() != null) {
            this.id = articleDto.getId();
        }
        if (articleDto.getBody() != null){
            this.body = articleDto.getBody();
        }
        if (articleDto.getTitle() != null) {
            this.link = articleDto.getTitle();
        }
        if (articleDto.getLink() != null) {
            this.link = articleDto.getLink();
        }
        if (articleDto.getRelevance() != null) {
            this.relevance = articleDto.getRelevance();
        }
        if (articleDto.getCreated() != null) {
            this.created = articleDto.getCreated();
        }
        if (articleDto.getUpdated() != null) {
            this.updated = articleDto.getUpdated();
        }
        if (articleDto.getImageData() != null) {
            this.imageData = articleDto.getImageData();
        }
    }

}