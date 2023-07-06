package com.devmountain.nlpApp.repositories;

import com.devmountain.nlpApp.entities.Article;
import com.devmountain.nlpApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// The ArticleRepository interface is a repository interface in the Spring Framework.
// It extends the JpaRepository interface, which is a part of Spring Data JPA, and provides methods for performing
// CRUD (Create, Read, Update, Delete) operations on the Article entity.

// @Repository annotation is used to indicate that the interface is a repository component.
// It allows the Spring container to automatically detect and create an instance of the repository bean
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findAllByUserEquals(User user);

    List<Article> findAllByBodyEquals(String body);
}