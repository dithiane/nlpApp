package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.dtos.UserDto;
import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.entities.User;
import com.devmountain.nlpApp.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

public class CategoryServiceImpl implements CategoryService{
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional
    public List<String> addCategory(CategoryDto categoryDto){
        List<String> response = new ArrayList<>();
        Category category = new Category(categoryDto);
        categoryRepository.saveAndFlush(category);
        response.add("http://localhost:8080/category.html");
        return response;
    }

}
