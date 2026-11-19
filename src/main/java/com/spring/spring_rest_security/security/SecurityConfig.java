// package com.spring.spring_rest_security.security;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.authentication.AuthenticationManager;
// import com.spring.spring_rest_security.service.CustomUserDetailsService;

// /**
//  * SecurityConfig
//  */
// @EnableWebSecurity 
// @Configuration 
// public class SecurityConfig {

//     private CustomUserDetailsService userDetailsService;
    

//     public SecurityConfig(CustomUserDetailsService userDetailsService) {
//         this.userDetailsService = userDetailsService;
//     }
    

//     public void setUserDetailsService(
//         CustomUserDetailsService userDetailsService
//     ) {
        
//         this.userDetailsService = userDetailsService;
//     }
    

//     public CustomUserDetailsService getUserDetailsService() {
//         return userDetailsService;
//     }


//     @Bean 
//     SecurityFilterChain filterChain(HttpSecurity security) 
//         throws Exception {
//             return security
//                 .csrf(AbstractHttpConfigurer::disable)
//                 .authorizeHttpRequests(
//                     auth -> auth
//                         .requestMatchers("/api/auth/**")
//                         .permitAll()
//                         .anyRequest()
//                         .authenticated()
//                 )
//                 .httpBasic(Customizer.withDefaults())
//                 .build();
//         }

//     @Bean 
//     BCryptPasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean 
//     AuthenticationManager authenticationManager
//         (AuthenticationConfiguration authentication) throws Exception {
//             return authentication.getAuthenticationManager();
//         }
// }