package com.devmountain.nlpApp.dtos;

import com.devmountain.nlpApp.entities.Category;
import com.devmountain.nlpApp.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto implements Serializable {
    private Long id;
    private String name;
    private Set<ArticleDto> articleDtoSet = new HashSet<>();

    public CategoryDto(String name) {
        this.name = name;
    }

    public CategoryDto(Category category) {
        if (category.getId() != null){
            this.id = category.getId();
        }
        if (category.getName() != null){
            this.name = category.getName();
        }
    }
    
}