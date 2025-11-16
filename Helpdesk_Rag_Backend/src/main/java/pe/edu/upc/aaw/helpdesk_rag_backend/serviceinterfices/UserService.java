package pe.edu.upc.aaw.helpdesk_rag_backend.serviceinterfices;

import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Users;

import java.util.List;

public interface UserService {
    public void insert(Users users);

    public List<Users> list();

    public void delete(Long idusers);

    public Users listarId(Long idusers);

    public void insertarRol(String rol, Long userId);

    void updateUser(Users u);
}