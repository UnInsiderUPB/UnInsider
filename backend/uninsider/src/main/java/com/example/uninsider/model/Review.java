package com.example.uninsider.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String text;

    @NotNull
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    private User author;

    @NotNull
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    private University university;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY)
    private Set<Appreciator> appreciators = new HashSet<>();

    @JsonIgnore
    @ElementCollection
    private Set<Long> likes = new HashSet<>();

    @JsonIgnore
    @ElementCollection
    private Set<Long> dislikes = new HashSet<>();

    public Review(String text, User author, University university) {
        this.text = text;
        this.author = author;
        this.university = university;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @JsonIgnore
    public User getAuthor() {
        return author;
    }

    @JsonProperty("author")
    public void setAuthor(User author) {
        this.author = author;
    }

    @JsonIgnore
    public University getUniversity() {
        return university;
    }

    @JsonProperty("university")
    public void setUniversity(University university) {
        this.university = university;
    }

    @JsonProperty("likes")
    public int getLikes() {
        return likes.size();
    }

    @JsonProperty("dislikes")
    public int getDislikes() {
        return dislikes.size();
    }

    public boolean addLike(Long userId) {
        return likes.add(userId);
    }

    public boolean addDislike(Long userId) {
        return dislikes.add(userId);
    }

    public boolean removeLike(Long userId) {
        return likes.remove(userId);
    }

    public boolean removeDislike(Long userId) {
        return dislikes.remove(userId);
    }

    public boolean isLikedBy(Long userId) {
        return likes.contains(userId);
    }

    public boolean isDislikedBy(Long userId) {
        return dislikes.contains(userId);
    }
}
