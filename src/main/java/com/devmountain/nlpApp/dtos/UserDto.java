package com.devmountain.nlpApp.dtos;

import com.devmountain.nlpApp.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;


// The UserDto class is a data transfer object (DTO) class in the Spring Framework.
// It is used to transfer user-related data between different layers of an application,
// such as between the controller and service layers or between the service and data access layers.

// @Data annotation is provided by the Lombok library and is used to automatically generate
// getter and setter methods, toString(), equals(), and hashCode() methods, and other boilerplate code.
@Data
/// @AllArgsConstructor annotation is provided by Lombok and generates a constructor with parameters
// for all fields in the class.
@AllArgsConstructor
// This annotation is provided by Lombok and generates a no-argument constructor for the class.
@NoArgsConstructor
public class UserDto implements Serializable {
    private Long id;
    private String username;
    private String password;
    private Set<ArticleDto> articleDtoSet = new HashSet<>();

    public UserDto(User user) {
        if (user.getId() != null){
            this.id = user.getId();
        }
        if (user.getUsername() != null){
            this.username = user.getUsername();
        }
        if (user.getPassword() != null){
            this.password = user.getPassword();
        }
    }
}