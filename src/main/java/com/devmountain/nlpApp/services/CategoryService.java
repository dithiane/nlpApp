package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.entities.Category;
import org.springframework.http.ResponseEntity;

import javax.transaction.Transactional;
import java.util.Optional;

public interface CategoryService {
    @Transactional
    Category addCategory(CategoryDto categoryDto);

    @Transactional
    void updateCategoryById(CategoryDto categoryDto);

    @Transactional
    boolean deleteCategoryById(Long categoryId);

    Optional<CategoryDto> getCategoryById(Long categoryId);

}
