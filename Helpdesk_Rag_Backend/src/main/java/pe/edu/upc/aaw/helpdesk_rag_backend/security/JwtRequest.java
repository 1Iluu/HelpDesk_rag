package pe.edu.upc.aaw.helpdesk_rag_backend.security;

import java.io.Serializable;

/*
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

//Clase 4
@Data
@AllArgsConstructor
@NoArgsConstructor*/
public class JwtRequest implements Serializable {
	private static final long serialVersionUID = 5926468583005150707L;
	private String mail;
	private String password;
	public JwtRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
	public JwtRequest(String mail, String password) {
		super();
		this.mail = mail;
		this.password = password;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	public String getMail() {
		return mail;
	}
	public String getPassword() {
		return password;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}