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

// The Category class is an entity class in the Spring Framework.
// It represents an article entity that can be stored and retrieved from a database.

// @Entity annotation is used to indicate that the class is an entity and should be mapped to a database table.
@Entity
// @Table(name = "Users"): This annotation specifies the name of the database table to which the entity is mapped.
@Table(name = "Categories")
// @Data annotation is provided by the Lombok library and is used to automatically generate getter and setter methods,
// toString(), equals(), and hashCode() methods, and other boilerplate code.
@Data
// @AllArgsConstructor annotation is provided by Lombok and generates a constructor with parameters
// for all fields in the class.
@NoArgsConstructor
// This annotation is provided by Lombok and generates a no-argument constructor for the class.
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference
    private Set<Article> articleSet = new HashSet<>();

    public Category(CategoryDto categoryDto){
        if (categoryDto.getId() != null){
            this.id = categoryDto.getId();
        }
        if (categoryDto.getName() != null){
            this.name = categoryDto.getName();
        }
    }

}