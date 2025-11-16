package pe.edu.upc.aaw.helpdesk_rag_backend.serviceinterfices;

import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Feedback;

import java.util.List;

public interface FeedbackService {
    public void insert(Feedback feedback);
    public void delete(int idFeedback);
    public List<Feedback> list();
    public Feedback listarId(int idFeedback);
}
