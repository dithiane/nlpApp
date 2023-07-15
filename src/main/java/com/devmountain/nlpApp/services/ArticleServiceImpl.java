package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.ArticleDto;
import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.entities.Article;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.entities.User;
import com.devmountain.nlpApp.repositories.ArticleRepository;
import com.devmountain.nlpApp.repositories.CategoryRepository;
import com.devmountain.nlpApp.repositories.UserRepository;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryService categoryService;
    // The @Override annotation is used to indicate that a method in a subclass is intended
    // to override a method with the same signature in its superclass or interface.
    @Override
    public List<ArticleDto> getAllArticlesByUserId(Long userId){
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()){
            List<Article> articleList = articleRepository.findAllByUserEquals(userOptional.get());
            Stream <ArticleDto> articleListUpdated = articleList.stream().map(article -> {
                ArticleDto articleDto = new ArticleDto();
                articleDto.setId(article.getId());
                articleDto.setTitle(article.getTitle());
                articleDto.setBody(article.getBody());
                articleDto.setCreated(article.getCreated());
                articleDto.setUpdated(article.getUpdated());
                articleDto.setUser(article.getUser());
                articleDto.setCategory(article.getCategory());
                articleDto.setImageData(article.getImageData());
                return articleDto;
            });
            return articleListUpdated.collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    @Override
    public CategoryProperties getNlpCategory(String body) {
        CategoryProperties categoryProperties = new CategoryProperties();
        try {
            // Create the URL object with the endpoint URL
            URL url = new URL("https://api.meaningcloud.com/class-2.0");

            // Open a connection to the URL
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set the request method to POST
            connection.setRequestMethod("POST");

            // Enable input and output streams
            connection.setDoInput(true);
            connection.setDoOutput(true);

            // Set the request body content type
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

            // Create the request parameters
            String params = "key=a9d53d71789ba56da286b62b244cd877"+
                            "&model=IPTC_en"+
                            "&txt=" + URLEncoder.encode(body, "UTF-8");

            DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream());
            outputStream.writeBytes(params);

            outputStream.flush();
            outputStream.close();

            // Get the response code
            int responseCode = connection.getResponseCode();

            // Read the response from the input stream
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            StringBuilder response = new StringBuilder();

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            // Print the response
            System.out.println("Response Code: " + responseCode);
            System.out.println("Response Body: " + response.toString());

            // Disconnect the connection
            connection.disconnect();
            JSONObject json = new JSONObject(response.toString());
            JSONArray responseArray = json.getJSONArray("category_list");
            if (responseArray.length() > 0) {
                JSONObject category = responseArray.getJSONObject(0);
                categoryProperties.label = category.getString("label");
                categoryProperties.relevance = category.getInt("relevance");
            }
            return responseCode == 200 ? categoryProperties : null;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public List<ArticleDto> getAllArticlesByBody(String body, Long userId){
        return userRepository.findById(userId)
                .map(user -> {
                    List<Article> articleList = articleRepository.findAllByUserEquals(user);
                    if (body != null) {
                        return articleList.stream()
                                .filter(article -> article.getBody().contains(body))
                                .map(ArticleDto::new)
                                .collect(Collectors.toList());
                    } else {
                        return articleList.stream()
                                .map(ArticleDto::new)
                                .collect(Collectors.toList());
                    }
                })
                .orElse(Collections.emptyList());
    }

    @Override
    @Transactional
    public void addArticle(ArticleDto articleDto, Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        CategoryProperties categoryProperties = getNlpCategory(articleDto.getBody());
        articleDto.setRelevance(categoryProperties.relevance);
        articleDto.setCreated(java.time.LocalDateTime.now());
        articleDto.setUpdated(java.time.LocalDateTime.now());
        Article article = new Article(articleDto);

        Optional<Category> categoryOptional = categoryRepository.findByName(categoryProperties.label);
        if (categoryOptional.isEmpty()) {
            CategoryDto categoryDto = new CategoryDto(categoryProperties.label);
            Category returnedCategory = categoryService.addCategory(categoryDto);
            article.setCategory(returnedCategory);
        } else {
            categoryOptional.ifPresent(article::setCategory);
        }

        userOptional.ifPresent(article::setUser);
        articleRepository.saveAndFlush(article);
    }

    @Override
    @Transactional
    public void deleteArticleById(Long articleId) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        articleOptional.ifPresent(article -> articleRepository.delete(article));
    }

    @Override
    @Transactional
    public void updateArticleById(ArticleDto articleDto) {
        Optional<Article> articleOptional = articleRepository.findById(articleDto.getId());
        articleOptional.ifPresent(article -> {
            if (articleDto.getBody() != null) article.setBody(articleDto.getBody());
            article.setBody(articleDto.getBody());
            if (articleDto.getCategory() != null) article.setCategory(articleDto.getCategory());
            article.setUpdated(java.time.LocalDateTime.now());
            if (articleDto.getImageData() != null) article.setImageData(articleDto.getImageData());
            article.setUpdated(java.time.LocalDateTime.now());
            articleRepository.saveAndFlush(article);
        });
    }

    @Override
    public Optional<ArticleDto> getArticleById(Long articleId) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        return articleOptional.map(ArticleDto::new);
    }
}