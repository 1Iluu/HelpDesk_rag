import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-usermanagement',
  imports: [CommonModule],
  host: { class: 'flex flex-col flex-1 min-h-0' },
  templateUrl: './usermanagement.html',
  styleUrls: ['./usermanagement.css']
})
export class Usermanagement {
  isAddOpen = false;

  isEditOpen = false;
  editing?: { name: string; email: string; role: 'Admin'|'Agent'|'User'; status: string; avatar: string };

  openEdit(u: any) {
    this.editing = { ...u };
    this.isEditOpen = true;
  }
  closeEdit() {
    this.isEditOpen = false;
    this.editing = undefined;
  }

  rows = [
    { name: 'Olivia Rhye', email: 'olivia@example.com', role: 'Admin', status: 'Active',  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGVbp51HlSQLok7147Ty0tfaLkocdkF3sQCaJ5fK7lMsM5XVJDwmeVeZkq6KNloBAWjjsOfS0i-ScqORO5VbNqLgaAZ49Nk1ZQX_uX2ZuA9f2drI9mgHEStYF3xBkSiZ_WbKOCHowgkR4yG_8QCjvNdmcAydmxOGDPfoF_STUZyX_lDJW7ehVcTbUndSurc9mRlLQbUIcA8BWogybg4n74hZN-UD1bmIwrUueHdaLPkQlL2wc0nuBaEbCRhGDPp_Vri6eQ9ThkY_w' },
    { name: 'Phoenix Baker', email: 'phoenix@example.com', role: 'Agent', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE-sMreo1dmOatPmDRZncRlbdxA93FzJJKdgCaZfvMOX2G-Axq9r0j8T5z1KEDV4rWRJmyeKeCtXGqpUyjGGY2Oy0NAvqJKW-Ib9o0kJKiSWhjl0IdVkVjDLE8GIHnTo3-n4m6MRF3kn7cgmik_iG_6uvt-kn_FZG9lxTBd7baKUaQxW8dJqOncQpDw4jzyTYuhBLy-T0jDKyszPdP2zpoPY_OZoACZsANkZboHxPJ1eeseU7U1j84nrk2tZpIwN7rMWWNRrBGPQU' },
    { name: 'Lana Steiner', email: 'lana@example.com', role: 'Agent', status: 'Pending', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlRMuFVbDlB0UM-YrqBgwp4iJc9oKu1Tsiwv19-N3cBZRtZwn27er75RIGWJB5o2sjJvjs_8pCSICHaj4fzkH3Brj37D01cAhUT4dTYmjeXNUdZN9CJWIo4Km2e_kohJgkYI9aqjh6fixIcAJK0lXfxIrqa4m_prk9pX9cxccLPkqiEqmbsK1DJhth3mE1g7i3UgWk9e3x-mf8-ZEd4HU4Bz7D1b9bBoyrEIMp-ibxQbtDymNEApXL9TPRrhbogjJyMPgjmk-r1vk' },
    { name: 'Candice Wu', email: 'candice@example.com', role: 'Agent', status: 'Inactive', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBhmgpxA5TxDRNsZDMLnQdS7FuHeXwXf7K9M5mZv8V6g36EvWM5hJQeHy6vSO4a6_FG5Bsfo57RFEHIbmNPfwpwwqAnGdJb2Vt5bDNG6dYeHPOiRfQ9o2Lv41EYf3Zz0umAc3RBAbV-CgVOvDWz6OCwN2-T_z33kI-iaoh2v2qyfbwa0DYPZ7BUcYGLyVWos0IcKO33qAOjRaHLcgXL5dlayYBV_bWHBg6hln_V94p_c6y0Y4cPw4WTqTBTHz7r_LxVHe7Q9-nrxg' },
  ];
}
