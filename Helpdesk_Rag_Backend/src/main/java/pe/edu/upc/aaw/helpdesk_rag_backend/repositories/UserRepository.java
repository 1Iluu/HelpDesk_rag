package pe.edu.upc.aaw.helpdesk_rag_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upc.aaw.helpdesk_rag_backend.entities.Users;


@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
	public Users findByMail(String mail);
	
	//BUSCAR POR NOMBRE
	@Query("select count(u.mail) from Users u where u.mail =:username")
	public int buscarUsername(@Param("username") String nombre);
	
	
	//INSERTAR ROLES
	@Modifying
	@Transactional
	@Query(value = "INSERT INTO roles(rol, user_id) VALUES (:rol, :userId)", nativeQuery = true)
	void insRol(@Param("rol") String rol, @Param("userId") Long userId);

	@Modifying
	@Transactional
	@Query(value = "UPDATE roles SET rol = :rol WHERE user_id = :userId", nativeQuery = true)
	void actualizarRol(@Param("rol") String rol, @Param("userId") Long userId);
	@Modifying
	@Transactional
	@Query("""
    UPDATE Users u
    SET u.name = :name,
        u.mail = :mail,
        u.enabled = :enabled,
        u.password = :password
    WHERE u.id = :id
""")
	void updateUserFields(
			@Param("id") Long id,
			@Param("name") String name,
			@Param("mail") String mail,
			@Param("enabled") Boolean enabled,
			@Param("password") String password
	);

	@Transactional
	@Modifying
	@Query("""
   UPDATE Users u
   SET u.name = :name,
       u.mail = :mail,
       u.password = COALESCE(:password, u.password),
       u.enabled = :enabled
   WHERE u.id = :id
""")
	void updateBasic(
			@Param("name") String name,
			@Param("mail") String mail,
			@Param("password") String password,
			@Param("enabled") Boolean enabled,
			@Param("id") Long id
	);
	@Modifying
	@Transactional
	@Query(value = "DELETE FROM roles WHERE user_id = :id", nativeQuery = true)
	void deleteRoles(@Param("id") Long id);
	@Modifying
	@Transactional
	@Query(value = "INSERT INTO roles(rol, user_id) VALUES (:rol, :id)", nativeQuery = true)
	void insertRol(@Param("rol") String rol, @Param("id") Long id);
}