package com.workflow.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Log request details
        System.out.println("🔍 Incoming request: " + request.getMethod() + " " + request.getRequestURI());

        // Log JWT secret length (to verify it's loaded)
        try {
            int secretLength = jwtUtil.getSecretLength();
            System.out.println("🔑 JWT secret length: " + secretLength);
        } catch (Exception e) {
            System.out.println("❌ Failed to get secret length: " + e.getMessage());
        }

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            System.out.println("🔑 JWT (first 30 chars): " + jwt.substring(0, Math.min(30, jwt.length())) + "...");
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("✅ Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("❌ Failed to extract username from JWT: " + e.getMessage());
                // Continue without authentication
            }
        } else {
            System.out.println("⚠️ No Authorization header or not Bearer");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                boolean isValid = jwtUtil.validateToken(jwt, userDetails);
                if (isValid) {
                    System.out.println("✅ Token validated for user: " + username);
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("❌ Token validation FAILED for user: " + username);
                    // Optionally, you can log the reason: expired, signature mismatch, etc.
                }
            } catch (Exception e) {
                System.out.println("❌ Exception during user load or validation: " + e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}