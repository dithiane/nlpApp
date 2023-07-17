package com.devmountain.nlpApp.entities;

import com.devmountain.nlpApp.dtos.CategoryDto;
import com.devmountain.nlpApp.dtos.UserDto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

@Entity
@Table(name = "Categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference(value="category")
    private Set<Article> articles;


    public Category(CategoryDto categoryDto){
        if (categoryDto.getId() != null){
            this.id = categoryDto.getId();
        }
        if (categoryDto.getName() != null){
            this.name = categoryDto.getName();
        }
    }

}