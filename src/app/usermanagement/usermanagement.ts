import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementApi, UserDTO } from '../api/usermanagement.api';

@Component({
  standalone: true,
  selector: 'app-usermanagement',
  imports: [CommonModule, FormsModule],
  host: { class: 'flex flex-col flex-1 min-h-0' },
  templateUrl: './usermanagement.html',
  styleUrls: ['./usermanagement.css'],
})
export class Usermanagement implements OnInit {
  private api = inject(UserManagementApi);
  search = signal<string>('');
  isAddOpen = false;
  isEditOpen = false;

  newUser: UserDTO = {
    name: '',
    mail: '',
    password: '',
    role: '',
    enabled: true,
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  };

  editing?: UserDTO;

  users = signal<UserDTO[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe({
      next: (list) => {

        const fixed = list.map(u => ({
          ...u,
          role: u.role ?? 'User'   // por si viene null
        }));

        this.users.set(fixed);
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }
  filteredUsers() {
  const term = this.search().toLowerCase();

  if (!term) return this.users();

  return this.users().filter(u =>
    u.name.toLowerCase().includes(term) ||
    u.mail.toLowerCase().includes(term) ||
    u.role?.toLowerCase().includes(term)
  );
  }
saveNewUser() {
    // 1. VALIDACIoN DEL CORREO 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.mail)) {
      alert('Error: El correo debe tener un formato valido (ejemplo@dominio.com).');
      return; 
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{6,}$/;
    if (!passRegex.test(this.newUser.password)) {
      alert(' Error: La contrasena debe tener al menos 6 caracteres, incluir una mayuscula, un numero y un caracter especial.');
      return; 
    }

    // 3. SI PASA LAS DEFENSAS, ENVIAMOS AL BACKEND
    this.api.createUser(this.newUser).subscribe({
      next: () => {
        this.isAddOpen = false;
        this.loadUsers();
        alert(' Usuario creado exitosamente.');
        // Reseteamos el formulario
        this.newUser = {
          name: '',
          mail: '',
          password: '',
          role: 'User',
          enabled: true,
          avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        };
      },
      error: (err) => {
        console.error('Error creando usuario', err);
        

        alert('Error: No se pudo crear el usuario. Es posible que este correo ya esté registrado en el sistema.');
      },
    });
  }

  openEdit(u: UserDTO) {
    this.editing = structuredClone(u);
    this.isEditOpen = true;
  }

  closeEdit() {
    this.isEditOpen = false;
    this.editing = undefined;
  }

saveEditUser() {
    if (!this.editing) return;

    if (!this.editing.name || this.editing.name.trim() === '') {
      alert(' Error: El nombre del usuario no puede estar vacio.');
      return; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editing.mail ?? '')) {
      alert(' Error: El correo debe tener un formato valido (ejemplo@dominio.com).');
      return;
    }

    this.api.updateUser(this.editing).subscribe({
      next: () => {
        this.closeEdit();
        this.loadUsers();
        alert(' Usuario actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error editando usuario', err);
        alert(' Error al actualizar. Es posible que el nuevo correo ya este en uso.');
      },
    });
  }

  deleteUser(id: number) {
      if (!confirm('Estas seguro de eliminar este usuario? Esta accion no se puede deshacer.')) return;

      this.api.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          alert(' Usuario eliminado correctamente.');
        },
        error: (err) => {
          console.error('Error eliminando usuario', err);
          alert(' Error: No se pudo eliminar el usuario.');
        },
      });
    }
}