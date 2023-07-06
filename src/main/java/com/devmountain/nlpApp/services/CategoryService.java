package com.devmountain.nlpApp.services;

import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.dtos.UserDto;
import com.devmountain.nlpApp.entities.Category;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface CategoryService {
    @Transactional
    List<String> addCategory(CategoryDto categoryDto);
}
