package com.example.uninsider.model;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "appreciators")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appreciator {

    public enum AppreciationType {
        LIKE,
        DISLIKE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long appreciatorId;

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    private User user;

    @NotNull
    @Enumerated(EnumType.ORDINAL)
    private AppreciationType appreciationType;

    public User getUser() {
        return user;
    }

    public AppreciationType getAppreciationType() {
        return appreciationType;
    }

    public void setAppreciationType(AppreciationType appreciationType) {
        this.appreciationType = appreciationType;
    }
}
