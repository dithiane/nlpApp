package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional
    public Category addCategory(CategoryDto categoryDto) {
        Category category = new Category(categoryDto);
        return categoryRepository.saveAndFlush(category);
    }

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
