package com.carrental.config;

import com.carrental.entity.Provider;
import com.carrental.entity.Role;
import com.carrental.entity.User;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Let Spring fetch the user details from Google.
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Provider provider = resolveProvider(userRequest.getClientRegistration().getRegistrationId());
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = extractEmail(provider, attributes);
        String name = extractName(attributes, email);
        String providerId = extractProviderId(provider, attributes);

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            updateExistingOAuthUser(userOptional.get(), provider, providerId, name);
        } else {
            registerNewUser(email, name, provider, providerId);
        }

        // Return the original OAuth2User object. Our CustomOAuth2SuccessHandler will handle the rest.
        return oAuth2User;
    }

    private Provider resolveProvider(String registrationId) {
        try {
            return Provider.valueOf(registrationId.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("unsupported_provider"),
                    "Unsupported OAuth provider: " + registrationId
            );
        }
    }

    private void registerNewUser(String email, String name, Provider provider, String providerId) {
        User user = User.builder()
                .name(name)
                .email(email)
                .provider(provider)
                .providerId(providerId)
                .role(Role.ROLE_PARTNER)
                .build();
        userRepository.save(user);
    }

    private void updateExistingOAuthUser(User user, Provider provider, String providerId, String name) {
        user.setProvider(provider);
        user.setProviderId(providerId);
        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        userRepository.save(user);
    }

    private String extractEmail(Provider provider, Map<String, Object> attributes) {
        String email = getString(attributes, "email");
        if (email != null && !email.isBlank()) {
            return email.trim().toLowerCase();
        }

        // Fallback if the OAuth provider does not return an email.
        String name = getString(attributes, "name");
        String id = extractProviderId(provider, attributes);
        if (id == null || id.isBlank()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("missing_provider_id"),
                    "OAuth provider did not return a stable user id."
            );
        }
        String cleanName = name != null ? name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase() : "user";
        return cleanName + "_" + id + "@" + provider.name().toLowerCase() + ".local";
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

    private String getString(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        return value == null ? null : String.valueOf(value);
    }
}
