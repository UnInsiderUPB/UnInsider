package com.example.uninsider.model;

import lombok.Data;

@Data
public class JwtResponse {
    String token;

    public JwtResponse(String token) {
        super();
        this.token = token;
    }

    public JwtResponse() {
        super();
        // [TODO]: Auto-generated constructor stub
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }


}
