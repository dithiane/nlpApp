package com.devmountain.nlpApp.entities;
import com.devmountain.nlpApp.dtos.ArticleDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

import static javax.persistence.CascadeType.ALL;

@Entity
@Table(name = "Articles")
@Data
@AllArgsConstructor
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
    @EqualsAndHashCode.Exclude @ToString.Exclude
    @JoinColumn(name="user_id")
    @JsonBackReference(value="user")
    private User user;

    @ManyToOne
    @JoinColumn(name="category_id")
    @EqualsAndHashCode.Exclude @ToString.Exclude
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