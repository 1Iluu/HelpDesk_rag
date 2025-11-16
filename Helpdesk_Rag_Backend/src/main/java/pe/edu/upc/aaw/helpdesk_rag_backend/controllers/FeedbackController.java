package pe.edu.upc.aaw.helpdesk_rag_backend.controllers;


import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.aaw.helpdesk_rag_backend.dtos.FeedbackDTO;
import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Feedback;
import pe.edu.upc.aaw.helpdesk_rag_backend.serviceinterfices.FeedbackService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService fS;
    @PostMapping
    public void registrar(@RequestBody FeedbackDTO dto) {
        ModelMapper m = new ModelMapper();
        Feedback f = m.map(dto, Feedback.class);
        fS.insert(f);
    }
    @GetMapping
    public List<FeedbackDTO> listar() {
        return fS.list().stream().map(x->{
            ModelMapper m=new ModelMapper();
            return m.map(x,FeedbackDTO.class);
        }).collect(Collectors.toList());

    }
    @GetMapping("/{id}")
    public FeedbackDTO listarId(@PathVariable("id") Integer id) {
        ModelMapper m=new ModelMapper();
        FeedbackDTO dto=m.map(fS.listarId(id),FeedbackDTO.class);
        return dto;
    }
    @PutMapping
    public void modificar(@RequestBody FeedbackDTO dto) {
        ModelMapper m = new ModelMapper();
        Feedback f = m.map(dto, Feedback.class);
        fS.insert(f);
    }
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable("id") Integer id) {
        fS.delete(id);
    }
}
