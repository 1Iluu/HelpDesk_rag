package pe.edu.upc.aaw.helpdesk_rag_backend.dtos;

import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Users;

import java.util.Date;

public class FeedbackDTO {
    private int idFeedback;
    private String chat_session;
    private int rating;
    private String coment;
    private Date created_at;
    private Users user_id;


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
