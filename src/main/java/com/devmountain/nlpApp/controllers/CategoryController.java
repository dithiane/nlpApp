package com.devmountain.nlpApp.controllers;

import com.devmountain.nlpApp.dtos.ArticleDto;
import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.services.CategoryService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @GetMapping("/category/{categoryId}")
    public Optional<CategoryDto> getCategoryById(@PathVariable Long categoryId){
        return categoryService.getCategoryById(categoryId);
    }

    @PutMapping
    public void updateCategory(@RequestBody CategoryDto categoryDto){
        categoryService.updateCategoryById(categoryDto);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategoryBy(@PathVariable Long categoryId){
        final Gson gson = new Gson();
        boolean isDeleted = categoryService.deleteCategoryById(categoryId);
        if (isDeleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(gson.toJson("There are Articles associated with this Category"));
    }
}
