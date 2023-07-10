package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.entities.Article;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.repositories.ArticleRepository;
import com.devmountain.nlpApp.repositories.CategoryRepository;
import com.devmountain.nlpApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Override
    @Transactional
    public Category addCategory(CategoryDto categoryDto) {
        Category category = new Category(categoryDto);
        return categoryRepository.saveAndFlush(category);
    }

    @Override
    public void updateCategoryById(CategoryDto categoryDto) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryDto.getId());
        categoryOptional.ifPresent(category-> {
            category.setName(categoryDto.getName());
            categoryRepository.saveAndFlush(category);
        });
    }

    @Override
    @Transactional
    public boolean deleteCategoryById(Long categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            List<Article> articles = articleRepository.findAllByCategory(category);
            if (articles.isEmpty()) {
                categoryRepository.delete(category);
                return true;
            }
        }
        return false;
    }

    @Override
    public Optional<CategoryDto> getCategoryById(Long categoryId) {

            Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
            if (categoryOptional.isPresent()) {
                CategoryDto categoryDto = new CategoryDto();
                categoryDto.setId(categoryOptional.get().getId());
                categoryDto.setName(categoryOptional.get().getName());
                return Optional.of(categoryDto);
            }

        return Optional.empty();
    }

//    @Override
//    public List<CategoryDto> getAllCategoriesByUserId(Long userId) {
//        Optional<User> userOptional = userRepository.findById(userId);
//        if (userOptional.isPresent()){
//            List<Category> articleList = categoryRepository.findAllByUserEquals(userOptional.get());
//            Stream<CategoryDto> categoryListUpdated = articleList.stream().map(category -> {
//                CategoryDto categoryDto = new CategoryDto();
//                categoryDto.setId(category.getId());
//                categoryDto.setName(category.getName());
//                return categoryDto;
//            });
//            return categoryListUpdated.collect(Collectors.toList());
//        }
//        return Collections.emptyList();    }

//    @Override
//    public Optional<Category> getCategoryIdByName(String categoryName) {
//        Optional<Category> category = categoryRepository.getCategoryIdByName(categoryName);
//        if (category.isEmpty()) {
//            Category newCategory = new Category();
//            newCategory.setName(categoryName);
//            categoryRepository.save(newCategory);
//            category = categoryRepository.getCategoryIdByName(categoryName);
//        }
//        return category;
//    }
}
