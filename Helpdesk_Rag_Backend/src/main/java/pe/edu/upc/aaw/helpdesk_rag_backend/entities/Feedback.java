package pe.edu.upc.aaw.helpdesk_rag_backend.entities;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idFeedback;
    @Column(name = "chat_session",nullable = false)
    private String chat_session;
    @Column(name = "rating",nullable = false)
    private int rating;
    @Column(name = "coment",nullable = false)
    private String coment;
    @Column(name = "created_at",nullable = false)
    private Date created_at;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user_id;

    public Feedback() {
    }
    public Feedback(int idFeedback, String chat_session, int rating, String coment, Date created_at, Users user_id) {
        this.idFeedback = idFeedback;
        this.chat_session = chat_session;
        this.rating = rating;
        this.coment = coment;
        this.created_at = created_at;
        this.user_id = user_id;
    }

    public int getIdFeedback() {
        return idFeedback;
    }

    public void setIdFeedback(int idFeedback) {
        this.idFeedback = idFeedback;
    }

    public String getChat_session() {
        return chat_session;
    }

    public void setChat_session(String chat_session) {
        this.chat_session = chat_session;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComent() {
        return coment;
    }

    public void setComent(String coment) {
        this.coment = coment;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Users getUser_id() {
        return user_id;
    }

    public void setUser_id(Users user_id) {
        this.user_id = user_id;
    }
}
