import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITEMS: Menu[] = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    role: '',
  },
  {
    state: 'category',
    name: 'Manage Category',
    icon: 'category',
    // role: 'admin',
    role: ''

  },

  {
    state: 'product',
    name: 'Manage Product',
    icon: 'inventory_2',
    // role: 'admin',
    role: ''

  },
  {
    state: 'order',
    name: 'Manage order',
    icon: 'list_alt',
    role: ''

  },
  {
    state: 'bill',
    name: 'View Bill',
    icon: 'import_contacts',
    role: ''

  },

  {
    state: 'user',
    name: 'View User',
    icon: 'people',
    role: ''

  },


];

@Injectable()
export class MenuItems {
  getMenuitems(): Menu[] {
    return MENUITEMS;
  }
}
