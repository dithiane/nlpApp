package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.ArticleDto;
import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.entities.Article;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.entities.User;
import com.devmountain.nlpApp.repositories.ArticleRepository;
import com.devmountain.nlpApp.repositories.CategoryRepository;
import com.devmountain.nlpApp.repositories.UserRepository;

//import org.json.JSONArray;
//import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;
import java.util.stream.Collectors;


// @Service annotation is used to indicate that the class is a service component.
// It allows the Spring container to automatically detect and create an instance of the service bean.
@Service
public class ArticleServiceImpl implements ArticleService {
    // UserRepository: This is a repository interface that provides methods for performing database operations
    // on the User entity. It is autowired into the ArticleServiceImpl class using the @Autowired annotation
    @Autowired
    private UserRepository userRepository;
    // ArticleRepository: This is a repository interface that provides methods for performing database operations
    // on the Article entity. It is autowired into the ArticleServiceImpl class using the @Autowired annotation
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
        //  Optional - It is used to represent an object that may or may not contain a non-null value.
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()){
            List<Article> articleList = articleRepository.findAllByUserEquals(userOptional.get());
            return articleList.stream().map(ArticleDto::new).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    @Override
    public String getNlpCategory(String body) {
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
            return responseCode == 200 ? response.toString() : "";
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    }

    //  The getAllArticlesByBody method retrieves a list of ArticleDto objects based on the provided body and userId.
    //  It filters the articles based on the body parameter if it is not null and returns the resulting list of ArticleDto objects.
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
    @Transactional // It means that when this method is invoked, a transaction will be started before the method
    // execution and committed after the method completes. If an exception occurs during the method execution,
    // the transaction will be rolled back, undoing any changes made within the method.
    public void addArticle(ArticleDto articleDto, Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
//        String s = getNlpCategory(articleDto.getBody());
//        JSONObject json = new JSONObject(s);
//;
//        JSONArray responseArray = json.getJSONArray("category_list");
//        JSONObject category = responseArray.getJSONObject(0);
//
//        articleDto.setRelevance(category.getInt("relevance"));
//        String name = category.getString("label");
        //     articleDto.set(category.getInt("relevance"));

        String name = "weather2";
        Integer relevance = 100;
        articleDto.setRelevance(relevance);
        Article article = new Article(articleDto);

        Optional<Category> categoryOptional = categoryRepository.findByName(name);
        if (categoryOptional.isEmpty()) {
            CategoryDto categoryDto = new CategoryDto(name);
            List<String> returnedCategory = categoryService.addCategory(categoryDto);
//            categoryDto.setName(name);
//            Category newCategory = new Category(categoryDto);
//            Category returnedCategory = categoryRepository.saveAndFlush(newCategory);
//            article.setCategory(returnedCategory);
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
            article.setBody(articleDto.getBody());
            articleRepository.saveAndFlush(article);
        });
    }

    @Override
    public Optional<ArticleDto> getArticleById(Long articleId) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        return articleOptional.map(ArticleDto::new);
    }
}