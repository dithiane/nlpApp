package com.devmountain.nlpApp.controllers;

import com.devmountain.nlpApp.dtos.UserDto;
import com.devmountain.nlpApp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


// The UserController class is a controller class in the Spring Framework.
// It handles incoming HTTP requests related to user operations and interacts with the UserService to perform
// the necessary operations.

// @RestController: This annotation is used to indicate that the class is a RESTful controller.
// It combines the @Controller and @ResponseBody annotations, simplifying the creation of RESTful APIs.

// @RequestMapping("/api/v1/users"): This annotation is used to specify the base URL path for all the endpoints defined
// in the controller.
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // This annotation maps the HTTP POST requests with the URL pattern /api/v1/users/register to the addUser() method.
    // It adds a new user by accepting a UserDto object in the request body and returns a list of strings.
    @PostMapping("/register")
    public List<String> addUser(@RequestBody UserDto userDto){
        String passHash = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(passHash);
        return userService.addUser(userDto);
    }

    // This annotation maps the HTTP POST requests with the URL pattern /api/v1/users/login to the userLogin() method.
    // It performs user login by accepting a UserDto object in the request body and returns a list of strings.
    @PostMapping("/login")
    public List<String> userLogin(@RequestBody UserDto userDto){
        return userService.userLogin(userDto);
    }
}