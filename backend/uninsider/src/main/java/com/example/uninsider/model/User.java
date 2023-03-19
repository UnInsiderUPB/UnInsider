package com.example.uninsider.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    //@Column(name = "iduser")
    private Long id;
    
    private String userName;
    private String password;

    private String firstName;
    private String lastName;
    private String email;

    private String phone;
    
    private boolean enabled = true;

    private String profile;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "user")
    @JsonIgnore
    private Set<UserRole> userRoleSet = new HashSet<>();

    public User() {
    }

    public User(Long id, String userName, String password, String firstName,
                String lastName, String email, boolean enabled, String profile) {
        this.id = id;
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.enabled = enabled;
        this.profile = profile;
    }
}
