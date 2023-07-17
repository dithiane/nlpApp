package com.devmountain.nlpApp.repositories;

import com.devmountain.nlpApp.entities.Article;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findAllByUserEquals(User user);

    List<Article> findAllByBodyEquals(String body);

    List<Article> findAllByCategory(Category category);
}