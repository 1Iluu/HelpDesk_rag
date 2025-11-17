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
        console.log("BACKEND USERS:", list);

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
    this.api.createUser(this.newUser).subscribe({
      next: () => {
        this.isAddOpen = false;
        this.loadUsers();

        this.newUser = {
          name: '',
          mail: '',
          password: '',
          role: 'User',
          enabled: true,
          avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        };
      },
      error: (err) => console.error('Error creando usuario', err),
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

    this.api.updateUser(this.editing).subscribe({
      next: () => {
        this.closeEdit();
        this.loadUsers();
      },
      error: (err) => console.error('Error editando usuario', err),
    });
  }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar usuario?')) return;

    this.api.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error eliminando usuario', err),
    });
  }
}