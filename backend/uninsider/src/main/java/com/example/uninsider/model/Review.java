package com.example.uninsider.model;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

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
    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    private University university;

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

    public User getAuthor() {
        return author;
    }

    public University getUniversity() {
        return university;
    }
}
