package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.dtos.UserDto;

import javax.transaction.Transactional;
import java.util.List;

public interface CategoryService {
    @Transactional
    List<String> addCategory(CategoryDto categoryDto);
}
