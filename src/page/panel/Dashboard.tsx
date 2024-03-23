import { SidebarComp } from '../../components/SidebarComp';
import { Button } from 'primereact/button';

export function Dashboard() {
  return (
    <div className="p-4">
      <SidebarComp />
      <p>dashboard</p>
    </div>
  );
}

export default Dashboard;
