package pe.edu.upc.aaw.helpdesk_rag_backend.serviceimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Users;
import pe.edu.upc.aaw.helpdesk_rag_backend.repositories.UserRepository;


import java.util.ArrayList;
import java.util.List;


//Clase 2
@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {

        Users user = repo.findByMail(mail);

        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + mail);
        }

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE" + user.getRole())
        );
        // --------------------------------

        return new org.springframework.security.core.userdetails.User(
                user.getMail(),
                user.getPassword(),
                user.getEnabled(),
                true,
                true,
                true,
                authorities
        );
    }
}