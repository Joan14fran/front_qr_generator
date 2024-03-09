
import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

export function Header() {

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    // Utiliza la función navigate de react-router-dom para cambiar la ruta
    navigate(path);
  };

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => handleNavigate('/home'),
    },
    {
      label: 'Auth',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          command: () => handleNavigate('/login'),
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          command: () => handleNavigate('/register'),
        },
      ]
    },
  ];
  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  )
}

export default Header