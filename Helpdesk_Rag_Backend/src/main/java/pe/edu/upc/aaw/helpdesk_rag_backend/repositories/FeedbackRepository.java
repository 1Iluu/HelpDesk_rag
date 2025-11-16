package pe.edu.upc.aaw.helpdesk_rag_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
}
