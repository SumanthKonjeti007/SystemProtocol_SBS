package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.UserService;
import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.exception.UserNotFoundException;
import com.securebanking.sbs.exception.UserRoleNotFoundException;
import com.securebanking.sbs.util.JwtTokenRequired;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.securebanking.sbs.dto.LoginDto;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    public UserService userService;

//    @PostMapping("/CreateOrUpdateUser")
//    @CrossOrigin(origins = "*")
//    public Void CreateOrUpdateUser(@RequestBody UserDto userDto){
//        return userService.createOrUpdateUser(userDto);
//    }

    @PostMapping("/createOrUpdateUser")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public ResponseEntity<Object> createOrUpdateUser(@Valid @RequestBody UserDto userDto) {
        try {
            HttpStatus result = userService.createOrUpdateUser(userDto);
            if (HttpStatus.OK == result) {
                return ResponseEntity.status(HttpStatus.OK).body("User created/Updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (UserRoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User role not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/register")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Object> register(@Valid @RequestBody UserDto userDto) {
        try {
            HttpStatus result = userService.register(userDto);
            if (HttpStatus.OK == result) {
                return ResponseEntity.status(HttpStatus.OK).body("Customer Registered successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Service error");
            }

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (UserRoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User role not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }


    @PostMapping("/login")
    @CrossOrigin("*")
    public UserDto login(@Valid @RequestBody LoginDto loginRequest) throws Exception {
        UserDto result = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return result;

    }

    @PostMapping("/validate-otp")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public ResponseEntity<String> validateOtp(@RequestBody Map<String, String> otpRequest) {
        String email = otpRequest.get("email");
        String otpEnteredByUser = otpRequest.get("otp");
        if (email == null || otpEnteredByUser == null) {
            return ResponseEntity.badRequest().body("Email and OTP must be provided");
        }
        if (userService.validateOtp(email, otpEnteredByUser)) {
            return ResponseEntity.ok("OTP is valid");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
    }

    @PostMapping("/generate-otp")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public ResponseEntity<String> generateOtp(@RequestBody String email) {

        if (userService.generate(email)) {
            return ResponseEntity.ok("OTP sent.");
        } else {
            return ResponseEntity.badRequest().body("OTP delivery failed.");
        }
    }

    @GetMapping("/userProfile")
    @JwtTokenRequired
    @CrossOrigin(origins = "*")
    public UserDto getUserProfile(@RequestParam Integer id) {
        return userService.getUserById(id);
    }

    @PostMapping("/deactiveUser")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public ResponseEntity<String> deactiveUser(@RequestParam Integer id) {

        try {
            HttpStatus result = userService.deactiveUser(id);
            if (HttpStatus.OK == result) {
                return ResponseEntity.ok("User deactivated successfully");
            } else {
                throw new Exception();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }

    }

    @PostMapping("/activateUser")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public ResponseEntity<String> activateUser(@RequestParam Integer id) {

        try {
            HttpStatus result = userService.activateUser(id);
            if (HttpStatus.OK == result) {
                return ResponseEntity.ok("User deactivated successfully");
            } else {
                throw new Exception();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }

    }

    @GetMapping("/hello")
    @CrossOrigin(origins = "*")
    public String helloWorld() {
        return "Welcome to Backend";
    }


}
