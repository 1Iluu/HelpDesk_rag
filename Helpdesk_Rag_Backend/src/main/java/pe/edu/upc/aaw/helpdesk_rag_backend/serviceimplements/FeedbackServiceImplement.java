package pe.edu.upc.aaw.helpdesk_rag_backend.serviceimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Feedback;
import pe.edu.upc.aaw.helpdesk_rag_backend.repositories.FeedbackRepository;
import pe.edu.upc.aaw.helpdesk_rag_backend.serviceinterfices.FeedbackService;

import java.util.List;

@Service
public class FeedbackServiceImplement implements FeedbackService {
    @Autowired
    private FeedbackRepository iF;
    @Override
    public void insert(Feedback feedback) {
        iF.save(feedback);
    }

    @Override
    public List<Feedback> list() {
        return iF.findAll();
    }
    @Override
    public void delete(int idFeedback) {
        iF.deleteById(idFeedback);
    }
    @Override
    public Feedback listarId(int idFeedback) {
        return iF.findById(idFeedback).orElse(new Feedback());
    }
}
