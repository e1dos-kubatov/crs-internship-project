package com.carrental.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomOAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        String redirectUrl = UriComponentsBuilder
                .fromUriString(resolveFrontendLoginUrl(request))
                .queryParam("oauth", "error")
                .queryParam("message", exception.getMessage())
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
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
