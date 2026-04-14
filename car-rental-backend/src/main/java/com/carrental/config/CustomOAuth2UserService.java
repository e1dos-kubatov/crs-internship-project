package com.carrental.config;

import com.carrental.entity.Provider;
import com.carrental.entity.Role;
import com.carrental.entity.User;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId().toUpperCase();
        Provider provider = Provider.valueOf(registrationId);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = extractEmail(provider, attributes);
        String name = extractName(attributes, email);
        String providerId = extractProviderId(provider, attributes);

        userRepository.findByEmail(email)
                .map(user -> updateExistingOAuthUser(user, provider, providerId, name))
                .orElseGet(() -> registerNewUser(email, name, provider, providerId));

        return new DefaultOAuth2User(
                oAuth2User.getAuthorities(),
                attributes,
                getNameAttributeKey(provider, attributes)
        );
    }

    private User registerNewUser(String email, String name, Provider provider, String providerId) {
        return userRepository.save(User.builder()
                .name(name)
                .email(email)
                .provider(provider)
                .providerId(providerId)
                .role(Role.ROLE_CUSTOMER)
                .password("") // OAuth user, no password needed
                .build());
    }

    private User updateExistingOAuthUser(User user, Provider provider, String providerId, String name) {
        user.setProvider(provider);
        user.setProviderId(providerId);
        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        return userRepository.save(user);
    }

private String extractEmail(Provider provider, Map<String, Object> attributes) {
        String email = getString(attributes, "email");
        if (email != null && !email.isBlank()) {
            return email.trim().toLowerCase();
        }
        // Fallback for providers that may not return email
        String name = getString(attributes, "name");
        String id = extractProviderId(provider, attributes);
        String fallbackEmail = (name != null ? name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase() : "user") + "_" + id + "@oauth.local";
        return fallbackEmail;
    }

    private String extractName(Map<String, Object> attributes, String email) {
        return Optional.ofNullable(getString(attributes, "name"))
                .orElse(Optional.ofNullable(getString(attributes, "login")).orElse(email));
    }

    private String extractProviderId(Provider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> Optional.ofNullable(getString(attributes, "sub")).orElse(getString(attributes, "id"));
            case GITHUB -> getString(attributes, "id");
            default -> null;
        };
    }

    private String getNameAttributeKey(Provider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> attributes.containsKey("email") ? "email" : "sub";
            case GITHUB -> "id";
            default -> "email";
        };
    }

    private String getString(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        return value == null ? null : value.toString();
    }
}
