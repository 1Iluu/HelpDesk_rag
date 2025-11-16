package pe.edu.upc.aaw.helpdesk_rag_backend.serviceimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Users;
import pe.edu.upc.aaw.helpdesk_rag_backend.repositories.UserRepository;
import pe.edu.upc.aaw.helpdesk_rag_backend.serviceinterfices.UserService;

import java.util.List;

@Service
public class UserServiceImplement implements UserService {

    @Autowired
    private UserRepository uR;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void insert(Users user) {

        if (user.getId() != null) {
            Users existing = uR.findById(user.getId()).orElse(null);

            if (existing != null && (user.getPassword() == null || user.getPassword().isBlank())) {
                user.setPassword(existing.getPassword());
            }
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        uR.save(user);
    }

    @Override
    public List<Users> list() {
        return uR.findAll();
    }

    @Override
    public void delete(Long idusers) {
        uR.deleteById(idusers);
    }

    @Override
    public Users listarId(Long idusers) {
        return uR.findById(idusers).orElse(new Users());
    }

    public void insertarRol(String rol, Long userId) {
        uR.insRol(rol, userId);
    }

    @Override
    public void updateUser(Users user) {

        Users original = uR.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no existe"));

        original.setName(user.getName());
        original.setLast_name(user.getLast_name());
        original.setMail(user.getMail());
        original.setEnabled(user.getEnabled());
        original.setRole(user.getRole());

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            original.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        uR.save(original);
    }
}