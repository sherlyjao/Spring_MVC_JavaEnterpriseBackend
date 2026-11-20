package com.spring.spring_rest_security.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.spring.spring_rest_security.dto.AuthLoginDto;
import com.spring.spring_rest_security.dto.AuthRoleRegisterDto;
import com.spring.spring_rest_security.dto.AuthUserRegisterDto;
import com.spring.spring_rest_security.entity.Auth_Role;
import com.spring.spring_rest_security.entity.Auth_User;
import com.spring.spring_rest_security.repository.AuthRoleRepository;
import com.spring.spring_rest_security.repository.AuthUserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

/**
 * REST controller handling authentication, user registration, and role
 * management endpoints under the {@code /api/auth} base path.
 */
@RestController 
@RequestMapping ("/api/auth")
public class AuthenticationController {

    private AuthenticationManager authenticationManager;
    private AuthUserRepository authUserRepo;
    private AuthRoleRepository authRoleRepo;
    private BCryptPasswordEncoder passwordEncoder;


    public AuthenticationController(
        AuthenticationManager authenticationManager, 
        AuthUserRepository authUserRepo,
        AuthRoleRepository authRoleRepo, 
        BCryptPasswordEncoder passwordEncoder
    ) {

        this.authenticationManager = authenticationManager;
        this.authUserRepo = authUserRepo;
        this.authRoleRepo = authRoleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new authorization role in the system if it does not already
     * exist.
     *
     * @param authRoleRegisterDto the DTO  the name of the role to register
     * @return a {@link ResponseEntity} containing message and status
     */
    @PostMapping ("/register_authorized_role")
    public ResponseEntity<String> register_authRole(
        @RequestBody AuthRoleRegisterDto authRoleRegisterDto
    ) {

        if (authRoleRepo.existsByName(
            authRoleRegisterDto.getName()
        )) {
            
            return new ResponseEntity<>(
                authRoleRegisterDto.getName() + "already created.", 
                HttpStatus.BAD_REQUEST
            );
        }

        Auth_Role auth_role = new Auth_Role();
        auth_role.setName(authRoleRegisterDto.getName());

        authRoleRepo.save(auth_role);

        return new ResponseEntity<>(
            auth_role.getName() + " is successfully created",
            HttpStatus.OK
        );
    }

    /**
     * Registers a new user account and assigns the default USER role.
     * 
     * @param authUserRegisterDto the DTO containing user registration details
     * @return a {@link ResponseEntity} containing message and status
     */
    @PostMapping ("/register_authorized_user")
    public ResponseEntity<String> register_authUser(
        @Valid @RequestBody AuthUserRegisterDto authUserRegisterDto
    ) {

        if (
            authUserRepo.existsByUsername(
                authUserRegisterDto.getUsername()
            )
        ) {
            
            return new ResponseEntity<>(
                authUserRegisterDto.getUsername() + " is already taken.",
                HttpStatus.BAD_REQUEST
            );
        }

        Auth_User auth_user = new Auth_User();
        auth_user.setUsername(authUserRegisterDto.getUsername());
        auth_user.setPassword(
            passwordEncoder.encode(authUserRegisterDto.getPassword())
        );

        Auth_Role auth_role = authRoleRepo
            .findByName("USER")
            .orElseThrow(
                () -> new RuntimeException("Roles USER not found")
            );
        auth_user.setRoles(Collections.singletonList(auth_role));

        authUserRepo.save(auth_user);

        return new ResponseEntity<>(
            auth_user.getUsername() + " is successfully registered",
            HttpStatus.OK
        );
    }

    /**
     * Authenticates a user and sets the security context authentication.
     * 
     * @param authLoginDto the DTO containing user login credentials
     * @return a {@link ResponseEntity} containing message and status
     */
    @PostMapping ("/auth_login")
    public ResponseEntity<String> login(
        @RequestBody AuthLoginDto authLoginDto
    ) {

        Authentication authenticate = authenticationManager
            .authenticate(
                new UsernamePasswordAuthenticationToken(
                    authLoginDto.getUsername(),
                    authLoginDto.getPassword())
            );

        SecurityContextHolder.getContext().setAuthentication(authenticate);

        return new ResponseEntity<>(
            "Sign in successfully!",
            HttpStatus.OK
        );
    }

    /**
     * Authenticates user credentials and establishes an HTTP session with
     * the Spring Security context.
     *
     * @param authLoginDto the DTO containing user login credentials
     * @param request      the incoming HTTP request used to create a session
     * @return a {@link ResponseEntity} containing a confirmation message
     */
    @PostMapping("/auth_login_session")
    public ResponseEntity<?> loginWithSession(
        @RequestBody AuthLoginDto authLoginDto, 
        HttpServletRequest request
    ) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                authLoginDto.getUsername(), 
                authLoginDto.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        HttpSession session  = request.getSession(true);
        session.setAttribute(
            "SPRING_SECURITY_CONTEXT", 
            SecurityContextHolder.getContext()
        );

        Map<String, String> response = new HashMap<>();
        response.put(
            "message", 
        "Authenticated successfully via session cookie."
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Invalidates the active HTTP session and clears the security context
     * to log out the current user.
     *
     * @param request the incoming HTTP request containing the current session
     * @return a {@link ResponseEntity} with an unauthorized status and message
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body("Logged out from session container.");
    }
    
}
