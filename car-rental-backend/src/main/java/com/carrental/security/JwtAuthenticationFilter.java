package com.carrental.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Check if the token exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        // 2. Extract the email from the token
        try {
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception ex) {
            // If token is malformed or expired, let the filter chain handle the rejection
            filterChain.doFilter(request, response);
            return;
        }

        // 3. If we have an email and the user is not yet authenticated in this session
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load the user fresh from the database (which includes their updated ROLE_PARTNER status)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 4. Validate the token against the user details
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // 5. Create the auth token, passing in the authorities (roles)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities() // <-- This successfully grants the ROLE_PARTNER access!
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Save the authentication in the Security Context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}