package com.carrental.config;

import com.carrental.entity.Provider;
import com.carrental.entity.User;
import com.carrental.repository.UserRepository;
import com.carrental.security.CustomUserDetails;
import com.carrental.security.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = normalize(safeGetString(oAuth2User, "email"));

        User user = resolveUser(authentication, oAuth2User, email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(new CustomUserDetails(user));
        String redirectUrl = UriComponentsBuilder
                .fromUriString(resolveFrontendLoginUrl(request))
                .queryParam("token", token)
                .queryParam("oauth", "success")
                .build()
                .toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private Optional<User> resolveUser(Authentication authentication, OAuth2User oAuth2User, String email) {
        Optional<User> byEmail = email == null ? Optional.empty() : userRepository.findByEmail(email);

        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            return byEmail;
        }

        Provider provider = Provider.valueOf(oauthToken.getAuthorizedClientRegistrationId().toUpperCase());
        String providerId = extractProviderId(provider, oAuth2User, authentication.getName());

        Optional<User> byProvider = providerId == null || providerId.isBlank()
                ? Optional.empty()
                : userRepository.findByProviderAndProviderId(provider, providerId);

        return byEmail.isPresent() ? byEmail : byProvider;
    }

    private String extractProviderId(Provider provider, OAuth2User oAuth2User, String authName) {
        return switch (provider) {
            case GOOGLE -> firstNonBlank(safeGetString(oAuth2User, "sub"), authName, safeGetString(oAuth2User, "id"));
            case GITHUB -> firstNonBlank(safeGetString(oAuth2User, "id"), authName);
            default -> null;
        };
    }

    // Safely converts Integer, Long, or String to String without throwing ClassCastException
    private String safeGetString(OAuth2User oAuth2User, String key) {
        Object value = oAuth2User.getAttribute(key);
        return value == null ? null : String.valueOf(value);
    }

    private String normalize(String value) {
        return value == null ? null : value.trim().toLowerCase();
    }

    private String firstNonBlank(String... candidates) {
        for (String candidate : candidates) {
            if (candidate != null && !candidate.isBlank()) {
                return candidate;
            }
        }
        return null;
    }

    private String resolveFrontendUrl(HttpServletRequest request) {
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            return frontendUrl;
        }
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }

    private String resolveFrontendLoginUrl(HttpServletRequest request) {
        String base = resolveFrontendUrl(request);
        if (base.endsWith("/login")) {
            return base;
        }
        if (base.endsWith("/")) {
            return base + "login";
        }
        return base + "/login";
    }
}